import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/asyncHandler';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto'

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

//@desk     Update logged-in user details
//@route    PUT /api/v1/auth/updatedetails
//@access   Private

export const updateDetails = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    if(!req.user) {
        return next(new ErrorResponse('Unauthorized', 401))
    }

    const newDetails = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user?.id, newDetails, {
        new: true, 
        runValidators: true
    })

    res.status(200).json({success: true, user})
})

//@desk     Update logged-in user password
//@route    PUT /api/v1/auth/updatepassword
//@access   Private

export const updatePassword = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    if(!req.user) {
        return next(new ErrorResponse('Unauthorized', 401))
    }

    const newPassword = req.body.password

    const user = await User.findById(req.user.id)

    if(!user) {
        return next(new ErrorResponse('User not found', 401))
    }

    user.password = newPassword

    await user.save()

    sendTokenResponse(user, 200, res)
})


//@desk     Forgot password
//@route    POST /api/v1/auth/forgotpassword
//@access   Public

export const forgotPassword = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.findOne({email : req.body.email})

    if(!user) {
        return next(new ErrorResponse('user not found', 404))
    }

    const resetToken = await user.generateResetToken();
    const link = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    await user.save({ validateBeforeSave:false });

    try {
        await sendEmail(req.body.email, link)
    } catch (error) {
        console.log(error)

        user.resetPasswordExpire = 0;
        user.resetPasswordToken = 'undefined'
        await user.save({ validateBeforeSave:false });

        res.status(500).json({success: false, data: 'Something went wrong with the server'})
    }

    res.status(200).json({success: true, user})
})


//@desk     Reset password
//@route    POST /api/v1/auth/resetpassword/:token
//@access   Private

export const resetPassword = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {


    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    console.log(resetPasswordToken)

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now()}
    })

    if(!user) {
        return next(new ErrorResponse('token is not valid', 404))
    }

    user.password = req.body.password
    user.resetPasswordExpire = 0;
    user.resetPasswordToken = 'undefined'
    await user.save();

    sendTokenResponse(user, 200, res)
})
