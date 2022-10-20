import validator from "validator";
import mongoose from "mongoose";

let date = new Date().toUTCString();


const otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expireIn: Number

},
    {
        timestamps: true,
        // expireAfterSeconds: 60
    });


const Otp = new mongoose.model('otp', otpSchema);


export default Otp;