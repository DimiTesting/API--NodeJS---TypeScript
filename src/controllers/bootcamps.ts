import { Request, Response, NextFunction } from 'express';
import {UploadedFile} from 'express-fileupload'
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import geocoder from '../utils/geocoder';
import path from 'path';

interface AuthenticatedRequest extends Request {
    user?: { 
        id: string,
        role: string
    };
}

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
export const createBootcamp = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    req.body.user = req.user?.id

    const publishedBootcamp = await Bootcamp.findOne({ user: req.user?.id})

    if(publishedBootcamp && req.user?.role !== 'admin' ) {
        next(new ErrorResponse(`The user id ${req.user?.id} has already published the bootcamp`, 404))
    }

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        sucess: true,
        data: bootcamp
    })        
})

//@desk     Update new bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
export const updateBootcamp = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if(bootcamp?.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user?.id} is not authorized to update this bootcamp`, 401))
    }

    if(!bootcamp)
        {
            return res.status(400).json({success: false})
        }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    })

    res.status(200).json({sucess: true, data: bootcamp})
})


//@desk     Delete new bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
export const deleteBootcamp = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(bootcamp?.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user?.id} is not authorized to update this bootcamp`, 401))
    }

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

//@desk     Add photo to bootcamp
//@route    PUT /api/v1/bootcamp/:id/photo
//@access   Private
export const uploadPhoto = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    if(bootcamp?.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user?.id} is not authorized to update this bootcamp`, 401))
    }

    if(!req.files) {
        return next(new ErrorResponse(`File not found`, 404))
    }


    if(Array.isArray(req.files)) {
        if(req.files[0].mimetype.includes('image')) {
            return next(new ErrorResponse(`File does not have the correct format ${req.files[0]}`, 404))
        } else {
            if (!String(req.files.mimetype).includes('image')) {
                return next(new ErrorResponse(`File does not have the correct format: ${req.files.mimetype}`, 404));
            }
        }
    }

    if(Number(req.files.size) > 1000000) {
        return next(new ErrorResponse(`File size is bigger than the limit`, 404))
    }

    const file = req.files.file

    let formattedName : string = '';

    if(Array.isArray(file))
    {
        formattedName = `photo_${bootcamp._id}${path.parse((file[0])?.name).ext}`
    }
    else 
    {
        formattedName = `photo_${bootcamp._id}${path.parse((file as UploadedFile).name).ext}`
    }

    if (Array.isArray(file)) {
        file.forEach(file => {
          file.mv(`./src/public/photos/${formattedName}`, async(err:Error) => {
            if(err) {
                console.log(err);
            }
    
            await Bootcamp.findByIdAndUpdate(req.params.id, {photo: formattedName});
    
            res.status(200).json({
                success: true,
                data: formattedName
            })
          });
        });
    } else {
        file.mv(`./src/public/photos/${formattedName}`, async(err:Error) => {
            if(err) {
                console.log(err);
            }
    
            await Bootcamp.findByIdAndUpdate(req.params.id, {photo: formattedName});
    
            res.status(200).json({
                success: true,
                data: formattedName
            })
          });        
    }
})
