import express from 'express'
import { protectAdmin } from '../middlewares/authmiddleware.js';
import { changeCredentia, changeStatus, getAllListings, getAllTransaction, getAllUnchangeListings, getAllUnverifiedListings, getAllWithdrawRequest, getCredential, getDashboard, isAdmin, markCredentialVerified, markWithdrawalAsPaid } from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.get('/isAdmin' , protectAdmin , isAdmin);
adminRouter.get('/deshboard' , protectAdmin , getDashboard);
adminRouter.get('/all-listings' , protectAdmin , getAllListings);
adminRouter.put('/change-status/:listingId' , protectAdmin , changeStatus);
adminRouter.get('/unverified-listings' , protectAdmin , getAllUnverifiedListings);
adminRouter.get('/credential/:listingId' , protectAdmin , getCredential);
adminRouter.put('/verify-credential/:listingId' , protectAdmin , markCredentialVerified);
adminRouter.get('/unchanged-listings' , protectAdmin , getAllUnchangeListings);
adminRouter.put('/change-credential/:listingId' , protectAdmin , changeCredentia);
adminRouter.get('/transactions' , protectAdmin , getAllTransaction);
adminRouter.get('/withdraw-requests' , protectAdmin , getAllWithdrawRequest);
adminRouter.put('/withdrawal-mark/:id' , protectAdmin , markWithdrawalAsPaid);

export default adminRouter