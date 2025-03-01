import mongoose from "mongoose";
import {Schema, Model} from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

interface IUser {
    name: string,
    email: string, 
    role: string, 
    password: string, 
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: Date
}

interface IUserMethods{
    getSignedJwtToken(): string
    matchPassword(enteredPassword: any): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String, 
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    role: {
        type: String, 
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String, 
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date, 
    createdAt: {
        type: Date, 
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, '3141rjiwe1411p1', {
        expiresIn : '2 days'
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', UserSchema);