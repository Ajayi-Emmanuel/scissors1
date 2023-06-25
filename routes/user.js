const express = require('express');
const userModel = require("../model/userModel")
const bycrypt = require("bcrypt")
// const userController = require("../controllers/user")
const userRoute = express.Router();
const {createToken} = require("../middleware")

userRoute.get('/signup', (req, res) => {
    res.render('signup', {
        error: false
    })
})

userRoute.get('/login', (req, res) => {
    res.render('login', {
        error: false
    })
})

userRoute.post('/signup', async (req, res) => {
    const {email,password} = req.body

    if(!email){
        return res.status(400).send({
            error: "Email field must be filled!"
        })
    }
    if(!password){
        return res.status(400).send({
            error: "Password field must be filled!"
        })
    }
    const user = await userModel.create({
        email,
        password,

    }).then((user) => {
        res.status(200).redirect('/login')
    }).catch((err) => {
        if (err.code === 11000) {
            res.status(403)
            res.render('signup', {
                error: "Duplicate Username or Mail"
            })
        }
    })
    
})

userRoute.post("/login", async (req, res) => {
    const {email, password} = req.body

    if(!email){
        return res.status(400).send({
            error: "Email field must be filled!"
        })
    }
    if(!password){
        return res.status(400).send({
            error: "Password field must be filled!"
        })
    }
    const user = await userModel.findOne({email}).lean()
    if(!user){
        res.status(403)
        res.render('login', {
            error: "User not found" 
        })
    }else{

        if(await bycrypt.compare(password, user.password)){ 

            const accessToken = createToken(user)
            res.cookie("token", accessToken, 
            {
                maxAge: 60*60*1000,
                httpOnly: true,
            })
        
            res.redirect('/scissors/autogenerate')
            
        }else{
            res.status(403)
            res.render('login', {
                error: "Incorrect Password or Email" 
            }) 
        }
    }
})


module.exports = userRoute