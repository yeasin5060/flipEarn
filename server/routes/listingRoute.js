import express from 'express'
import { protect } from '../middlewares/authmiddleware.js';
import { addCredential, addListing, deleteUserListing, getAllPublicListing, getAllUserListing, getAllUserOrder, markFeatured, purchaseAmount, toggleStatus, updateListing, withdrawnAmount } from '../controllers/listingcontroller.js';
import upload from '../multer/multer.js';

const listingRouter = express.Router()

listingRouter.post('/', upload.array('images', 5), protect, addListing);
listingRouter.put('/', upload.array('images', 5), protect, updateListing);
listingRouter.get('/public', getAllPublicListing);
listingRouter.get('/user', protect, getAllUserListing);
listingRouter.put('/:id/status', protect, toggleStatus);
listingRouter.delete('/:listingId', protect, deleteUserListing);
listingRouter.post('/add-credential', protect, addCredential);
listingRouter.put('/featured/:id', protect, markFeatured);
listingRouter.get('/user-orders', protect, getAllUserOrder);
listingRouter.post('/withdraw', protect, withdrawnAmount);
listingRouter.post('/purchase/:listingId', protect, purchaseAmount);

export default listingRouter;