import { Request, Response, NextFunction } from 'express';
import Bootcamp from '../models/Bootcamp';

//@desk     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
export const getBootcamps = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            sucess: true,
            data: bootcamps
        })        
    } catch (error) {
        res.status(400).json({ success: false})
    }
}

//@desk     Get single bootcamps
//@route    GET /api/v1/bootcamp/:id
//@access   Public
export const getBootcamp = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp)
        {
            res.status(400).json({success: false})
        }

        res.status(200).json({sucess: true, data: bootcamp})
    } catch (error) {
        res.status(400).json({success: false})
    }
}

//@desk     Create new bootcamp
//@route    POST /api/v1/bootcamp/
//@access   Private
export const createBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            sucess: true,
            data: bootcamp
        })        
    } catch (error) {
        res.status(400).json({ success: false})
    }
}

//@desk     Update new bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
export const updateBootcamp = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        })

        if(!bootcamp)
            {
                res.status(400).json({success: false})
            }

        res.status(200).json({sucess: true, data: bootcamp})

    } catch (error) {
        res.status(400).json({ success: false})
    }
}


//@desk     Delete new bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
export const deleteBootcamp = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if(!bootcamp)
            {
                res.status(400).json({success: false})
            }

        res.status(200).json({sucess: true, data: "bootcamp has been deleted"})

    } catch (error) {
        res.status(400).json({ success: false})
    }
}

