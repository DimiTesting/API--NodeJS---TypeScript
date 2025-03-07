import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';

interface AuthenticatedRequest extends Request {
    user?: { 
        id: string,
        role: string
    };
}


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

//@desk     Get single review
//@route    GET /api/v1/reviews/:id
//@access   Public

export const getSingleReview = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if(!review) {
        next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true, 
        data: review
    });
});

//@desk     Create review
//@route    GET /api/v1/bootcamps/:bootcampId/reviews
//@access   Private

export const createReview = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    console.log(req.params.bootcampId)

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user?.id

    if(!req.body.bootcamp) {
        next(new ErrorResponse(`Bootcamp id ${req.body.bootcamp} is not found `, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true, 
        data: review
    });
});