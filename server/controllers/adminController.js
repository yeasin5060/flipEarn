import { prisma } from "../src/db.js";

//controller for cheking if user is admin
export const isAdmin = async (req,res)=> {
    try {
        return res.json({isAdmin: true});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}


export const getDashboard = async (req,res)=> {
    try {
       const totalListing = await prisma.listing.count({});
       const transaction = await prisma.transaction.findMany({
        where : {isPaid : true},
        select : { amount : true}
       });

        const totaRevenue = transaction.reduce((total,transaction)=> total + transaction.amount,0);
        const activeListing = await prisma.listing.count({
            where : {status : 'active'}
        });

        const totalUser = await prisma.user.count({});
        const recentListings = await prisma.listing.findMany({
           orderBy : {createdAt : 'desc'},
           take: 5,
           include : {owner : true}
        });

        return res.json({dashboardData : {totalListing , totaRevenue , activeListing, totalUser , recentListings}});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//controller for getting all listing
export const getAllListings = async (req,res)=> {
    try {
         const listings = await prisma.listing.findMany({
           orderBy : {createdAt : 'desc'},
           include : {owner : true}
        });

        if(!listings || listings.length === 0){
            return res.json({listings:[]});
        }

        return res.json({listings})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//change listing status
export const changeStatus = async (req,res)=> {
    try {
        const {listingId} = req.params;
        const {status} = req.body;

        const listing = await prisma.listing.findUnique({
            where : {id : listingId}
        });

        if(!listing){
            return res.status(404).json({message :'Listing not found'});
        }

        await prisma.listing.update({
            where : {id: listingId},
            data : {status}
        });

        return res.json({message : 'Listing status updated'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//controller for getting all unverified listing with credential submited
export const getAllUnverifiedListings = async (req,res)=> {
    try {
         const listings = await prisma.listing.findMany({
            where : {
                isCredentialSubmitted : true,
                isCredentialVerified : false,
                status : {not : 'deleted'}
            },
            orderBy : {createdAt : 'desc'},
        });

        if(!listings || listings.length === 0){
            return res.json({listings:[]});
        }

        return res.json({listings})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//controller for getting credential
export const getCredential = async (req,res)=> {
    try {
        const {listingId} = req.params;
        const credential = await prisma.credential.findFirst({
            where : {listingId}
        });

        if(!credential){
            return res.status(404).json({message :'Credential not found'});
        }

        return res.json({credential});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//mark credential as verified
export const markCredentialVerified = async (req,res)=> {
    try {
        const {listingId} = req.params;
        
        await prisma.listing.update({
            where : {id:listingId},
            data : {isCredentialVerified: true}
        });

         return res.json({message : 'Credential mark as verified'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//get all un-chenge listings
export const getAllUnchangeListing = async (req,res)=> {
    try {
        const listings = await prisma.listing.findMany({
            where : { 
                isCredentialVerified: true,
                isCredentialChanged: false,
                status : {not : 'deleted'}
            },
            orderBy : {createdAt : 'desc'}
        });
        
        if(!listings || listings.length === 0){
            return res.status(404).json({listings : []});
        }

        return res.json({listings});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//change credential for verified listing

export const changeCredentia = async (req,res)=> {
    try {
        const {listingId} = req.params;
        const {newCredential , credentialId} = req.body;

        await prisma.credential.update({
            where : { id : credentialId, listingId},
            data : {updatedCredential : newCredential}
        });

        await prisma.listing.update({
            where : {id : listingId},
            data : {isCredentialChanged : true}
        });

        return res.json({message : 'Credential change successfully'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//get all transactions
export const getAllTransaction = async (req,res)=> {
    try {
        const transactions = await prisma.transaction.findMany({
            where : {isPaid : true},
            orderBy : {createdAt : 'desc'},
            include : {listing : {include : {owner : true}}}
        });

        const customers = await prisma.user.findMany({
            where : {id : {in : transactions.map((t)=>t.userId)}},
            select : {id : true , email : true , name : true, image : true}
        });

        transactions.forEach((t)=> {
            const customer = customers.find((c)=> c.id === t.userId);
            t.listing.customer = {...customer}
        });

        if(!transactions || transactions.length === 0){
            return res.json({transactions:[]});
        }

        return res.json({transactions});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//controller for getting all withdraw request
export const getAllWithdrawRequest = async (req,res)=> {
    try {
       const request = await prisma.withdrawal.findMany({
            orderBy : {createdAt: 'desc'},
            include : {user : true}
       });

        if(!request || request.length === 0){
            return res.json({request:[]});
        }

        return res.json({request});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}

//controller for marking withdraw as paid
export const markWithdrawalAsPaid = async (req,res)=> {
    try {
        const {id} = req.params;
        const withdraw = await prisma.withdrawal.findUnique({
            where : {id}
        });

        if(!withdraw){
            return res.status(404).json({message : 'Withdraw not found'});
        }

        if(withdraw.isWithdrawn){
            return res.status(400).json({message : 'Withdraw alredy marked as paid'});
        }

        await prisma.withdrawal.update({
            where : {id},
            data : {isWithdrawn : true}
        });

        return res.json({message : 'Withdraw marked as paid'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}





