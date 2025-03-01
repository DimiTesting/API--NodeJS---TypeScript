import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { 
    id: string,
    role: string
}}



export const protect = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } //else if (req.cookies.token) {
        //token = req.cookies.token
    //}

    if(!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));  
    }

    try {
        const decoded = jwt.verify(token, '3141rjiwe1411p1');
        console.log(decoded);
        const user = await User.findById((decoded as any).id); 

        if (!user) {
        throw new Error("User not found");
        }

        req.user = {id : user.id, role: user.role}

        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));  
    }
})

export const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        if(!req.user) {
            return next(new ErrorResponse('Not authorized to access this route', 401));  
        }

        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));  
        }
        next();
    }
}