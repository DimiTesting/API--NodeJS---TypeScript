import { Request, Response, NextFunction } from 'express';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';

//@desk     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
export const getBootcamps = asyncHandler(async(req: Request, res: Response) => {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({
        sucess: true,
        count: bootcamps.length,
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

