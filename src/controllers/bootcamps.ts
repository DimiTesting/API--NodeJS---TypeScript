import { Request, Response, NextFunction } from 'express';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import geocoder from '../utils/geocoder';

//@desk     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
export const getBootcamps = asyncHandler(async(req: Request, res: Response) => {
    let query;

    const reqQuery = {...req.query};
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

    if(req.query.select) {
        const fields = (<string>req.query.select).split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort) {
        const sortBy = (<string>req.query.sort).split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(<string>req.query.page, 10) || 1;
    const limit = parseInt(<string>req.query.limit, 10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit)

    const bootcamps = await query;

    interface Pagination {
        next?: {page: number; limit: number};
        prev?: {page: number; limit: number};
      }

    let pagination: Pagination = {};

    if(endIndex<total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex>0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        sucess: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps
    })        
})

//@desk     Get single bootcamps
//@route    GET /api/v1/bootcamp/:id
//@access   Public
export const getBootcamp = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
 
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp)
    {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.json({sucess: true, data: bootcamp})

})

//@desk     Get bootcamps within radius
//@route    GET /api/v1/bootcamp/:zipcode/:distance
//@access   Public
export const getBootcampsInRadius = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
 
    const {zipcode, distance} = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = Number(distance) / 3963;

    const bootcamps = await Bootcamp.find({
        location : { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true, 
        count: bootcamps.length,
        data: bootcamps
    })

})

//@desk     Create new bootcamp
//@route    POST /api/v1/bootcamp/
//@access   Private
export const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        sucess: true,
        data: bootcamp
    })        
})

//@desk     Update new bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
export const updateBootcamp = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    })

    if(!bootcamp)
        {
            return res.status(400).json({success: false})
        }

    res.status(200).json({sucess: true, data: bootcamp})
})


//@desk     Delete new bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
export const deleteBootcamp = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(!bootcamp)
        {
            return res.status(400).json({success: false})
        }

    res.status(200).json({sucess: true, data: {}})

})


//@desk     Delete all bootcamp
//@route    DELETE /api/v1/bootcamp/
//@access   Private
export const deleteAllBootcamp = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.deleteMany({})
    res.status(200).json({sucess: true, data: {}})

})

