import validator from "validator";
import mongoose from "mongoose";

let date =  new Date().toUTCString();


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 3,
        
    },
    name: {
        type: String,
        default: 0
    },
    email: {
        type: String,
        require: true,
        unique: [true, "Email is already in use"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    pancard: {
        type: Number,
        default: 0
    },
    adharcard: {
        type:Number,
        default: 0
       
    },
    phonenum: {
        type:Number,
        default: 0
    },
    status : {
        type:Number,
        default: 0
    },
    otp:{
        type:Number,
        default: 0
    },
    createdAt:{
        type:Date,
        default: date
    }
})

const User  = new mongoose.model('user',userSchema);


export default  User;