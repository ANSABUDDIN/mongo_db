import express from 'express';
import Jwt from 'jsonwebtoken';
import cors from 'cors';
import './config.js';
import User from './models/user.js';
import Otp from './models/otp.js';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import passport from 'passport';
// import './passport.js';
import cookieSession from 'cookie-session';


const app = express();
app.use(express.json());
app.use(cors());
// app.use(cookieSession({
//     name: 'google-auth-session',
//     keys: ['key1', 'key2']
// }));
// app.use(passport.initialize());
// app.use(passport.session());


app.post('/changepassword', async (req, resp) => {
    const otpcheak = await Otp.findOne({ code: req.body.code });
    // console.log(otpcheak.email);
    if (otpcheak) {
        // console.log("otp found")
        const usercheak = await User.updateOne(
            { email: otpcheak.email },
            {
                $set: { password: req.body.password }
            });
        if (usercheak.modifiedCount == 1 && usercheak.matchedCount == 1) {
            // console.log("Password Upadted");
            resp.status(200).json({
                mess: "Password Upadted Successfully"
            });
        } else {
            resp.status(500).json({
                mess: "Password Not Upadted"
            });
            // console.log("Password Not Upadted");
        }
        // console.log(usercheak);
    } else {
        resp.status(500).json({
            mess: "Invalid Otp"
        });
    }
    if (otpcheak == null) {
        resp.status(500).json({
            mess: "Invalid Otp"
        });
    }

});
app.get('/', async (req, resp) => {
    // resp.send("<button><a href='/auth'>Login With Google</a></button>")
    resp.send("hello node is live")
});
app.post('/forget', async (req, resp) => {
    const deletedata = await Otp.deleteMany({ email: req.body.email })
    if (deletedata) {
        console.log(deletedata)
        let data = await User.findOne({ email: req.body.email });
        if (data) {
            const otpcode = Math.floor(1000 + Math.random() * 9000);
            const otpdata = new Otp({
                email: req.body.email,
                code: otpcode,
                expireIn: new Date().getTime() + 300 * 1000
            });

            let otpresponse = await otpdata.save();
            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'developer1274@gmail.com',
                    pass: 'zgiqdtkwtkiyeuzh'
                }
            }));
            let mailOptions = {
                from: 'developer1274@gmail.com',
                to: req.body.email,
                subject: "Your Otp Code",
                html: `<h1>Your Otp Code is ${otpresponse.code} </h1>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return (
                        resp.status(500).json({
                            status: true,
                            mess: "Email Address Not Found"

                        })
                    )
                }

                console.log('success');
            });
            resp.status(200).json({
                status: true,
                mess: "Cheak Your Email Address"

            });
        } else {
            resp.status(500).json({
                result: "Email Not Found",
                status: false

            });
        }
    } else {
        resp.status(500).json({
            result: "Email Not Found",
            status: false

        });
    }
});
app.post('/register', async (req, resp) => {
    const { username, email, password } = req.body
    const user = new User({
        username,
        email,
        password
    });
    user.save().then(async (data) => {
        const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        let email = data.email
        // const data_with_token = { email,
        //      token, code: 200 }
        resp.status(200).json({
            token: token,
            email: email,
            status: true,
            mess: "User Register"
        });
    }).catch((e) => {
        resp.send(
            {
                error: e,
                status: true,
                mess: "User Not Register Try Again"
            }
        )
    })
});
app.post('/kycdetails', async (req, resp) => {
    await User.updateOne(
        { email: req.body.email },
        {
            $set: { phonenum: req.body.phonenum, pancard: req.body.pancard, adharcard: req.body.adharcard, name: req.body.name }
        }
    ).then(result => {
        if (result.matchedCount == 0) {
            resp.status(500).json({
                result: result,
                status: false,
                mess: "No Email Found"

            });
        }
        if (result.matchedCount == 1) {
            resp.status(500).json({
                result: result,
                status: true,
                mess: "user match"

            });
        }
    }).catch(error => {
        resp.status(500).json({
            error: error,
            mess: "invalid Req"

        });
    })
});
app.post('/login', async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password")
        // console.log(pass)
        // var passwordmatch = compareSync(req.body.password, user);
        const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        if (user) {
            resp.status(200).json({
                Email: user.email,
                token: token,
                status: true,
                mess: "User Login"
            });
        } else {
            resp.json({
                result: "No User Found !"
            })
        }
    } else {
        resp.json("Enter Email Or Password")
    }
});
app.post('/getotp', (req, resp) => {

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'developer1274@gmail.com',
            pass: 'zgiqdtkwtkiyeuzh'
        }
    }));
    let mailOptions = {
        from: 'developer1274@gmail.com',
        to: "weblinxwork@gmail.com",
        subject: "Your Otp Code",
        text: '123456'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // return console.log(error.message);
            resp.status(500).send({
                status: true,
                mess: "Email Address Not Found"

            });
        }
        resp.status(200).send({
            status: true,
            mess: "Cheak Your Email Address"

        });
        console.log('success');
    });


});
// app.post('/google-auth', (req, resp) => {
//     resp.status(200).send({
//         mess: "Google Auth Is Run"
//     })

// })





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`your Port is ${PORT}`)
})



// app.post('/forget', async (req, resp) => {

//     let data = await User.findOne({ email: req.body.email });
//     if (data) {
//         const otpcode = Math.floor(1000 + Math.random() * 9000);
//         const otpdata = new Otp({
//             email: req.body.email,
//             code: otpcode,
//             expireIn: new Date().getTime() + 300 * 1000
//         });

//         let otpresponse = await otpdata.save();
//         var transporter = nodemailer.createTransport(smtpTransport({
//             service: 'gmail',
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: 'ansabuddin0346@gmail.com',
//                 pass: 'lbrdsjnwkinhfuvk'
//             }
//         }));
//         let mailOptions = {
//             from: 'ansabuddin0346@gmail.com',
//             to: req.body.email,
//             subject: "Your Otp Code",
//             html: `<h1>Your Otp Code is ${otpresponse.code} </h1>`
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return (
//                     resp.status(500).json({
//                         status: true,
//                         mess: "Email Address Not Found"

//                     })
//                 )
//             }

//             console.log('success');
//         });
//         resp.status(200).json({
//             status: true,
//             mess: "Cheak Your Email Address"

//         });


//     } else {
//         resp.status(500).json({
//             result: "Email Not Found",
//             status: false

//         });
//     }
// });