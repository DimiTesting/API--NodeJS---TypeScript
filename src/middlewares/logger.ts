import { Request, Response, NextFunction } from 'express';

//@desk     Logs request to console
export const logger = (req: Request, res: Response, next: NextFunction) =>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}


