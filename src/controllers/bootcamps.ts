import { Request, Response, NextFunction } from 'express';

//@desk     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
export const getBootcamps = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({sucess: true, message: 'Show all bootcamps'})
}

//@desk     Get single bootcamps
//@route    GET /api/v1/bootcamp/:id
//@access   Public
export const getBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({sucess: true, message: `Show bootcamp ${req.params.id}`})
}

//@desk     Create new bootcamp
//@route    POST /api/v1/bootcamp/
//@access   Private
export const createBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({sucess: true, message: 'Create new bootcamp'})
}

//@desk     Update new bootcamp
//@route    POST /api/v1/bootcamp/:id
//@access   Private
export const updateBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({sucess: true, message: `Update bootcamp ${req.params.id}`})
}


//@desk     Delete new bootcamp
//@route    POST /api/v1/bootcamp/:id
//@access   Private
export const deleteBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({sucess: true, message: `Delete bootcamp ${req.params.id}`})
}

