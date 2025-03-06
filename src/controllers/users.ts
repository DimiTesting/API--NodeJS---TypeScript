import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto'

interface AuthenticatedRequest extends Request {
    user?: { 
        id: string,
        role: string
    };
}

//@desk     Get all users
//@route    GET /api/v1/auth/users
//@access   Private/Admin

export const getUsers = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const users = await User.find({})

    if(!users) {
        return next(new ErrorResponse('no users found', 404))
    }

    res.status(200).json({success: true, data: users})
})

//@desk     Get single user
//@route    GET /api/v1/auth/users/:id
//@access   Private/Admin

export const getUserById = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.findById(req.params.id)

    if(!user) {
        return next(new ErrorResponse(`User id not ${req.params.id} found `, 404))
    }
    
    res.status(200).json({success: true, data: user})
})

//@desk     Create user
//@route    POST /api/v1/auth/users/
//@access   Private/Admin

export const createUser = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.create(req.body)
    
    res.status(201).json({success: true, data: user})
})

//@desk     Update user
//@route    PUT /api/v1/auth/users/:id
//@access   Private/Admin

export const updateUser = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true, 
        runValidators : true
    })
    
    res.status(201).json({success: true, data: user})
})

//@desk     Delete user
//@route    DELETE /api/v1/auth/users/:id
//@access   Private/Admin

export const deletUser = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.findByIdAndDelete(req.params.id)
    
    res.status(201).json({success: true, data : {}})
})