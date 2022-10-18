import express from 'express';
// import con from './config.js'
import Jwt from 'jsonwebtoken';
import cors from 'cors';
import './config.js';
import User from './models/user.js';
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, resp) => {
    // con.query("select * from user", (err, result) => {
    //     if (err) {
    //         resp.send("error")
    //     }
    //     else {
    //         resp.send(result)
    //     }
    // })
});
app.post('/register', (req, resp) => {
    const { username, email, password } = req.body
    const user = new User({
        username,
        email,
        password
    });
    user.save().then(async (data) => {
        const token = await Jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        let email = data.email
        const data_with_token = { email, token, code: 200 }
        resp.status(200).send(data_with_token)
    }).catch((e) => {
        resp.send(e)
    })
});

app.post('/login', (req, resp) => {
    const data = {
        "email": req.body.email,
        "password": req.body.password,
    }

    con.query(`select * from user where email = '${req.body.email}'`, (error, result, field) => {
        if (result.length == 0) {
            resp.status(500).send({
                msg: "Email Incorrect"
            });

        } else {
            const token = Jwt.sign(data.email, "thisisupcomingnftsecreatekeyitshouldlong");
            if (result[0].password == req.body.password) {
                resp.status(500).send({
                    msg: "Login",
                    token: token
                });
            }
            else {
                resp.status(500).send({
                    msg: "Password Incorrect"
                });
            }
        }
    });
});
app.post('/forget', (req, resp) => {
    const data = {
        "email": req.body.email

    }

    con.query(`select * from user where email = '${req.body.email}'`, (error, result, field) => {
        if (result.length == 0) {
            resp.status(500).send({
                msg: "Email Incorrect"
            });

        } else {
            const otp = Math.floor(1000 + Math.random() * 9000);
            con.query(`UPDATE user set otp = '${otp}' WHERE email = '${req.body.email}'`, (error, result, field) => {
                resp.status(200).send({
                    msg: "Otp Generate Sucessfully"

                });


            })
        }
    });
});


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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`your Port is ${PORT}`)
})