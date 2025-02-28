import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

//@desk     Register user
//@route    GET /api/v1/auth/register
//@access   Public

export const register = asyncHandler(async(req: Request, res: Response) => {
    const {name, email, password, role} = req.body

    const user = await User.create({name, email, password, role});


    
    res.status(200).json({success: true})
})