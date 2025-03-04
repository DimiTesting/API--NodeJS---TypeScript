import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { 
        id: string,
        role: string
    };
  }

//@desk     Register user
//@route    POST /api/v1/auth/register
//@access   Public

export const register = asyncHandler(async(req: Request, res: Response) => {
    const {name, email, password, role} = req.body

    const user = await User.create({name, email, password, role});
    
    sendTokenResponse(user, 200, res)
})

//@desk     Login user
//@route    POST /api/v1/auth/login
//@access   Public

export const login = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body

    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user: any, statusCode: number, res:Response) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 2 * 24*60*1000),
        httpOnly: true,
        secure: true
    }

    res
       .status(statusCode)
       .cookie('token', token, options)
       .json({success: true, token})
}

//@desk     Get current logged user
//@route    POST /api/v1/auth/me
//@access   Private

export const getMe = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    if(!req.user) {
        return next(new ErrorResponse('Unauthorized', 401))
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        return next(new ErrorResponse('user not found', 404))
    }

    console.log(user)

    res.status(200).json({success: true, user})
})


