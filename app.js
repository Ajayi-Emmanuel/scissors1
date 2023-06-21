const express = require("express")
require("dotenv").config()
const randomize = require("./random")
const qrcode = require("qrcode")
const urlModel = require("./model/urlModel")
const userModel = require("./model/userModel")
const {connectToDb} = require("./db")
const bycrypt = require("bcrypt")


const app = express();
const PORT = process.env.PORT || 3000;

connectToDb()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public')) 

// const homeRoute = require('./routes/index')

app.set('view engine', 'ejs')
// app.use('/blog', homeRoute)

app.get('/scissors/signup', (req, res) => {
    res.render('signup')
})

app.get('/scissors/login', (req, res) => {
    res.render('login')
})

app.get('/scissors/dashboard', (req,res) => {
    res.render('dashboard')
})

app.get('/scissors/autogenerate', (req,res) => {
    res.render('auto')
})

app.get('/scissors/history', (req,res) => { 
    res.render('history')
})

app.get('/scissors/custom', (req,res) => {
    res.render('custom')
})
app.post('/scissors/signup', async (req, res) => {
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
        password
    })
    res.status(200).redirect('/scissors/login')
})

app.post("/scissors/login", async (req, res) => {
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
        res.status(403).json({
            msg: "User not Found"
        })
    }else{

        if(await bycrypt.compare(password, user.password)){
            res.status(200).json({
                msg: "Login successfull"
            })
        }else{
            res.status(403).json({
                msg: "Wrong password"
            })
        }
    }
})

app.post("/scissors/autogenerate", (req, res) => {
    const {fullurl} = req.body 
    newLink = randomize()
    const code = qrcode.toDataURL(fullurl, (err, url) => {
        console.log(url)
    })

    urlModel.create({fullurl, newLink})  
    res.json({ 
        message: "Successfull",
        newLink: newLink,
        qrcode: code
    })
    
})

app.post("/scissors/custom", (req, res)=> {
    const {fullurl, shorturl} = req.body
    const newLink = shorturl

    urlModel.create({fullurl, newLink})
    res.json({ 
        message: "Successfull",
        newLink: newLink
    })
})

app.get("/history", async (req, res) => {
    const allLinks = await urlModel.find()
    res.send(allLinks)
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})