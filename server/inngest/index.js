import { Inngest } from "inngest";
import { prisma } from "../src/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "profile-marketplace" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },

  async ({ event }) => {
    const { data } = event;

    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (user) {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data?.email_addresses?.[0]?.email_address,
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url,
        },
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses?.[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
        image: data?.image_url,
      },
    });
  }
);

// ✅ inngest function to the Delete user

export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },

  async ({ event }) => {
    const { data } = event;

    try {
      // ✅ Check existence first
      const user = await prisma.user.findUnique({
        where: { id: data.id },
      });

      if (!user) return;

      // ✅ Count instead of findMany (faster)
      const [listingCount, chatCount, transactionCount] = await Promise.all([
        prisma.listing.count({ where: { ownerId: data.id } }),
        prisma.chat.count({
          where: {
            OR: [
              { ownerUserId: data.id },
              { chatUserId: data.id },
            ],
          },
        }),
        prisma.transaction.count({ where: { userId: data.id } }),
      ]);

      // ✅ If no dependencies → delete user
      if (listingCount === 0 && chatCount === 0 && transactionCount === 0) {
        await prisma.user.delete({
          where: { id: data.id },
        });
      } else {
        // ✅ Soft delete (recommended)
        await prisma.user.update({
          where: { id: data.id },
          data: { status: "deleted" }, // 👈 better than doing nothing
        });

        await prisma.listing.updateMany({
          where: { ownerId: data.id },
          data: { status: "inactive" },
        });
      }

      return { success: true };

    } catch (error) {
      console.error("Delete sync error:", error);
      return { success: false, message: error.message };
    }
  }
);

// ✅ inngest function to the Update user
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const {data} = event;

    await prisma.user.update({
        where : {id : data.id},
        data : {
            email:data?.email_addresses[0].email_address,
            name:data?.first_name + " " +data?.last_name,
            imageUrl:data?.image_url,
        }
    })
  }
);


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];