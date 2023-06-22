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
    res.render('login', {
        error: false
    })
})

app.get('/scissors/autogenerate', (req,res) => {
    res.render('autogen', {
        check:false
    })
})

app.get('/scissors/custom', (req,res) => {
    res.render('custom', {
        check: false
    })
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
        res.status(403)
        res.render('login', {
            error: "User not found" 
        })
    }else{

        if(await bycrypt.compare(password, user.password)){   
            res.redirect('/scissors/autogenerate')
        }else{
            res.status(403)
            res.render('login', {
                error: "Incorrect Password or Email" 
            })
        }
    }
})

app.post("/scissors/autogenerate", async (req, res) => {
    const {fullurl} = req.body
    newLink = randomize()

    //create QRCODE
    qrcode.toDataURL(fullurl, async (err, src) => {
        if(err) res.send("Error occured")

        await urlModel.create({fullurl, newLink, src})
        const link = await urlModel.findOne({newLink}).lean()
        res.render('autogen', {
            check: true,
            src, 
            link})
    })
    
})

app.post("/scissors/custom", async(req, res)=> {
    const {fullurl, shorturl} = req.body
    const newLink = shorturl

    qrcode.toDataURL(fullurl, async (err, src) => {
        if(err) res.send("Error occured")

        await urlModel.create({fullurl, newLink, src})
        const link = await urlModel.findOne({newLink}).lean()

        res.render('custom', {
            check: true,
            src, 
            link
        })
    })

})

app.get('/:shortid', async (req, res) => {
    const short = req.params.shortid.split(':');
    shortid = short[1]
    urlDetails = await urlModel.findOne({newLink: shortid})   
    if (!urlDetails) return res.status(404);

    urlDetails.clicks++ 
    urlDetails.save()
    res.redirect(urlDetails.fullurl)
})

app.get("/scissors/history", async (req, res) => {
    const allLinks = await urlModel.find()
    res.render("history", {allLinks})

})

app.listen(PORT, () => { 
    console.log(`App listening at http://localhost:${PORT}`);
})