import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';


//@desk     Get all courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public
export const getCourses = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let query; 

    if(req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId});
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true, 
        count: courses.length, 
        data: courses
    });
});