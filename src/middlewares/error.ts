import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    
    console.log(err);


    console.log(err.name)

    if(err.name === 'CastError')
    {
        const message = `Bootcamp not found with id of ${err.value}`;
        err = new ErrorResponse(message, 404)
    }

    if(err.code === 11000)
    {
        const message = `Duplicate field value entered`
        err = new ErrorResponse(message, 404)
    }
    
    if(err.name === 'ValidatorError')
    {
        const message = 'Some of the mandatory fields are missing';
        err = new ErrorResponse(message, 404)
    }


    res.status(err.statusCode || 500 ).json({
        success: false,
        error: err.message || 'Server Error'
    });
}

export default errorHandler