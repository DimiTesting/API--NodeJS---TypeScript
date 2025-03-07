import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';

//@desk     Get all reviews
//@route    GET /api/v1/reviews
//@access   Public

export const getReviews = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let query; 

    if(req.params.bootcampId) {
        query = Review.find({bootcamp: req.params.bootcampId});
    } else {
        query = Review.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const reviews = await query;

    res.status(200).json({
        success: true, 
        count: reviews.length, 
        data: reviews
    });
});
