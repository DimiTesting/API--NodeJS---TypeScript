import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import bootcampRouter from './routes/bootcamps';
import coursesRouter from './routes/courses';
import reviewsRouter from './routes/reviews'
import authRouter from './routes/auth'
import userRouter from './routes/users'
import connectDB from '../config/db';
import errorHandler from './middlewares/error';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser'
import path = require('path');

import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

dotenv.config({path: './config/config.env'});

connectDB()

const bootcamps = bootcampRouter
const courses = coursesRouter
const auth = authRouter
const users = userRouter
const reviews = reviewsRouter

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})

app.use(limiter)
app.use(hpp())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

const PORT = process.env.PORT || 5000; 

const server = app.listen(PORT, 
    () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err: Error, promise) => {
    console.log(`Error ${err.message}`)
    server.close(()=> process.exit(1))
})