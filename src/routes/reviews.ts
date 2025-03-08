import { Router } from 'express';
import { getReviews, getSingleReview, createReview, updateReview, deleteReview } from '../controllers/reviews';
import { authorize, protect } from '../middlewares/auth';

const router = Router({mergeParams: true})

router
    .route('/')
    .get(getReviews)
    .post(protect, authorize('user', 'admin'), createReview)

router
    .route('/:id')
    .get(getSingleReview) 
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)

export default router