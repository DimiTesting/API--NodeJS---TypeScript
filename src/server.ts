import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import bootcampRouter from './routes/bootcamps';
import connectDB from '../config/db';

dotenv.config({path: './config/config.env'});

connectDB()

const bootcamps = bootcampRouter

const app = express();

app.use(express.json())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000; 

const server = app.listen(PORT, 
    () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err: Error, promise) => {
    console.log(`Error ${err.message}`)
    server.close(()=> process.exit(1))
})