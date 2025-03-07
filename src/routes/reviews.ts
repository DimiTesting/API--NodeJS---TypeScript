import { Router } from 'express';
import { getReviews, getSingleReview } from '../controllers/reviews';

const router = Router({mergeParams: true})

router
    .route('/')
    .get(getReviews)

router
    .route('/:id')
    .get(getSingleReview) 

export default router