import { Inngest } from "inngest";
import { prisma } from "../src/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "profile-marketplace" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event}) => {
        const { data } = event;

        // Check if user already exists in the database
        const user = await prisma.user.findFirst({
            where : {id : data.id}
        });
        if(user){
            //update user data if it exists
            await prisma.user.update({
                where : {id : data.id},
                data : {
                    email:data?.email_addresses[0].email_address,
                    name:data?.first_name + " " +data?.last_name,
                    imageUrl:data?.image_url,
                }
            });
            return;
        }
        await prisma.user.create({
            data : {
                id: data.id,
                email:data?.email_addresses[0].email_address,
                name:data?.first_name + " " +data?.last_name,
                imageUrl:data?.image_url,
            }
        });
    },
);

// ✅ inngest function to the Delete user

export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk", triggers: [{ event: "clerk/user.deleted" }],
    },
    async ({ event}) => {
        const { data } = event;

        const listings = await prisma.listing.findMany({
            where : {ownerId : data.id}
        });

        const chats = await prisma.chat.findMany({
            where : {OR : [{ownerUserId : data.id },{chatUserid : data.id}]}
        });

         const transactions = await prisma.transaction.findMany({
            where : {userId : data.id}
        });

        if(listings.length === 0 && chats.length === 0 && transactions.length === 0){
            await prisma.user.delete({where : {id: data.id}});
        }else{
            await prisma.listing.updateMany({
                where : {ownerId : data.id},
                data : {status : "inactive"}
            });
        }
       
    },
)

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