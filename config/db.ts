import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DB_CONNECTION || 'undefined')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
}


export default connectDB