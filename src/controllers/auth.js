const User = require('../models/user')
const mailgun = require("mailgun-js");
const jwt = require('jsonwebtoken')
const DOMAIN = 'sandbox76ee498cbdb44f8bb418efd6939e983d.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

//without email activation
// exports.signup = (req,res)=>{
//     console.log(req.body)
//     const {name,email,password} = req.body
//     User.findOne({email}).exec((err,user)=>{
//         if (user) {
//             return res.status(400).json({error:"User with this email already exists"})
//         }
//         let newUser = new User({name,email,password})
//         newUser.save((err,success)=>{
//             if (err) {
//                 console.log("error in signup: " , err)
//                 return res.status(400),json({error:err})
//             }
//             res.json({
//                 message:"signup success !!"
//             })
//         })
//     })
// }

exports.signup = (req, res) => {
    console.log(req.body)
    const { name, email, password, isVerified } = req.body
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" })
        }

        const token = jwt.sign({ name, email, password, isVerified }, process.env.SECRET_KEY, { expiresIn: '10h' })


        const data = {
            from: 'noreply@hello.com',
            to: email,
            subject: 'Account Activation',
            html: `
            <h2>Please click link to activate</h2>
            <p>${process.env.CLIENT_URL}/api/email-activate/${token}</p>
            `
        };
        mg.messages().send(data, function (error, body) {
            if (error) {
                return res.json({
                    error: err.message
                })
            }
            return res.json({ message: 'email has been sent' })
        });

        // let newUser = new User({name,email,password})
        // newUser.save((err,success)=>{
        //     if (err) {
        //         console.log("error in signup: " , err)
        //         return res.status(400),json({error:err})
        //     }
        //     res.json({
        //         message:"signup success !!"
        //     })
        // })
    })
}

exports.activateAccount = (req, res) => {
    const token = req.params.token
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: 'incorrect or expired link' })
            }
            decodedToken.isVerified = 1        
            const { name, email, password, isVerified } = decodedToken
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    return res.status(400).json({ error: "User with this email already exists" })
                }
                let newUser = new User({ name, email, password ,isVerified})
                newUser.save((err, success) => {
                    if (err) {
                        console.log("error in signup while account activation: ", err)
                        return res.status(400), json({ error: err })
                    }
                    res.json({
                        message: "signup success !!"
                    })
                })
            })
        })
    } else {
        return res.json({ error: "something went wrong" })
    }
}