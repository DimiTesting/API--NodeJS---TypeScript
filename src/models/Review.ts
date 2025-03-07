import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true,
        required: [true, 'Please add a review title'],
        maxlength: 100
    }, 
    text: {
        type: String, 
        required: [true, 'Please add a text']
    },
    rating: {
        type: Number, 
        min: 1,
        max: 10, 
        required: [true, 'Please add a rating between 1 and 10']
    }, 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

export default mongoose.model('Review', ReviewSchema);