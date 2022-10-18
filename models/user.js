import validator from "validator";
import mongoose from "mongoose";
let date =  new Date().toUTCString();


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3
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
    approved : {
        type:Number,
        default: 1
    },
    createdAt:{
        type:Date,
        default: date
    }
})

const User  = new mongoose.model('user',userSchema);


export default  User;