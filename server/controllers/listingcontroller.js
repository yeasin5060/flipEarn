// Controller for adding listing to database

import imagekit from "../imagekit/imagekit.js";
import { prisma } from "../src/db.js";
import fs from 'fs'

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

        accountDetails.username.startWith('@') ? accountDetails.username = accountDetails.username.slice(1) : null ;
        
        const uploadImages = req.files.map(async(file)=> {
            const response = await imagekit.files.upload({
                file: fs.createReadStream('file.path'),
                fileName:`${Date.now()}.png`,
                folder : 'flip-earn',
                transformation : {pre : 'w-1280 , h-auto'}
            });
            return response.url
        });

        //with for all uploads to complete
        const images = await Promise.all(uploadImages);
        const listing = await prisma.listing.create({
            data : {
                ownerId : userId,
                images,
                ...accountDetails
            }
        });
        return res.status(201).json({message : 'Acount listed successfully' , listing})
    } catch (error) {
        console.log(error);
         return res.status(500).json({message : error.message})
    }
}

//Controller for getting all public listing

export const getAllPublicListing = async (req , res) => {
    try {
        const listings = await prisma.listing.findMany({
            where : {status : 'active'},
            include : {owner : true},
            orderBy : {createdAt : 'desc'}
        });

        if(!listings || listings.length === 0){
            return res.json({listings : []});
        }
        return res.status(200).json({listings});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
}