import { Router } from 'express';
import { getReviews } from '../controllers/reviews';

const router = Router({mergeParams: true})

router
    .route('/')
    .get(getReviews)

export default router