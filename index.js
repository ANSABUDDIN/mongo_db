import express from 'express';
import Jwt from 'jsonwebtoken';
import cors from 'cors';
import './config.js';
import User from './models/user.js';
import Otp from './models/otp.js';
import nodemailer from 'nodemailer';
import pkg from 'bcryptjs';
// import passport from 'passport';
// import googleStragety from 'passport-google-oauth20';




const app = express()
const { hashSync, genSaltSync, compareSync } = pkg;

app.use(express.json())
app.use(cors())



// passport.use(new googleStragety({
// clientId:
// }))





app.get('/', (req, resp) => {
    
    resp.send("node server is run");
});
app.post('/register', async (req, resp) => {
    const { username, email, password } = req.body
    const user = new User({
        username,
        email,
        password
    });
    // const salt = genSaltSync(10);
    // user.password = hashSync(user.password, salt);
    user.save().then(async (data) => {
        const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        let email = data.email
        const data_with_token = { email, token, code: 200 }
        resp.status(200).send(data_with_token)
    }).catch((e) => {
        resp.send(e)
    })
});
app.post('/kyc', async (req, resp) => {
    const { adharcard, pancard, phonenumber } = req.body;

    User.updateOne(
        { email: req.body.email },
        {
            $set: { phonenum: "2323232530" , pancard: "0333230" , adharcard : "656233226326313" }
        }
    ).then(result => {
        if(result.matchedCount == 0){
            resp.status(500).send({
                result: result,
                mess:"no user match"
    
            })
        }
        if(result.matchedCount == 1){
            resp.status(500).send({
                result: result,
                mess:"user match"
    
            })
        }
        
    }).catch(error => {
        resp.status(500).send({
            error: error,
            mess:"invalid Req"

        })
    })
    // console.log(result)
    // if(!result){
    //     resp.status(200).send({
    //         Email: "Data Submit" ,

    //     }) 
    // }else{
    //     resp.send({
    //         result: "No User Found !"
    //     })
    // }



});
app.post('/login', async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password")
        // console.log(pass)
        // var passwordmatch = compareSync(req.body.password, user);
        const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        if (user) {
            resp.status(200).send({
                Email: user.email,
                token: token
            })
        } else {
            resp.send({
                result: "No User Found !"
            })

        }
    } else {
        res.send("Enter Email Or Password")

    }
});
app.post('/forget', async (req, resp) => {
    let data = await User.findOne({ email: req.body.email });
    if (data) {
        const otpcode = Math.floor(1000 + Math.random() * 9000);
        const otpdata = new Otp({
            email: req.body.email,
            code: otpcode,
            expireIn: new Date().getTime() + 300 * 1000
        });
        let otpresponse = await otpdata.save();

        resp.status(200).send({
            result: "Please Cheak Your Email Id"
        })

    } else {
        resp.status(500).send({
            result: "Email Not Found"
        })
    }
});


// mailer fun

// app.post('/register', (req, res) => {
//     const { name, email, password } = req.body
//     const user = new User({
//         name,
//         email,
//         password
//     });
//     user.save().then(async (data) => {
//         const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
//         let email = data.email
//         const data_with_token = { email, token, code: 200 }
//         res.status(200).send(data_with_token)
//     }).catch((e) => {
//         res.send(e)
//     })
// })


const mymailer = () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ansabuddin0346gmail.com',
            pass: 'alhouotwxqmxhcmw'
        }
    });
    const mailOptions = {
        from: 'ansabuddin0346gmail.com',
        to: 'ansabuddin0346gmail.com',
        subject: 'Subject',
        text: 'Email content'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`your Port is ${PORT}`)
})