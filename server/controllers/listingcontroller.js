// Controller for adding listing to database

import { prisma } from "../src/db.js";

export const listing = async (req,res)=> {
    try { 
        const {userId} = await req.auth();
        if(req.plan !== 'premium'){
            const listingCount = await prisma.listing.count({
                where : {ownerId : userId}
            });
            if(listingCount >= 5){
                return res.status(400).json({message :'You have reached the free listing limit'});
            }
        }
        const accountDetails = JSON.parse(req.body.accountDetails);
        accountDetails.followers_count = parseFloat( accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat( accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat( accountDetails.monthly_views);
        accountDetails.price = parseFloat( accountDetails.price);
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();

        accountDetails.username.startWith('@') ? accountDetails.username = accountDetails.username.slice(1) : null
    } catch (error) {
        
    }
}