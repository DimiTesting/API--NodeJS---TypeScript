import express from 'express'
import dotenv from 'dotenv'
import bootcampRouter from './routes/bootcamps';

const bootcamps = bootcampRouter

dotenv.config({path: './config/config.env'});

const app = express();

app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000; 

app.listen(PORT, 
    () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);