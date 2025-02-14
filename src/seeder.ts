import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bootcamp from './models/Bootcamp';

dotenv.config({path: '../config/config.env'});

const conn = mongoose.connect(process.env.DB_CONNECTION || 'mongodb+srv://dimi:dimi@clusterfordevcamper.jdyuv.mongodb.net/?retryWrites=true&w=majority&appName=ClusterForDevCamper')
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

const importData = async() => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data imported...')
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data deleted...')
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-v') {
    deleteData()
}


