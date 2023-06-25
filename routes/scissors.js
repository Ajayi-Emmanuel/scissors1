const express = require("express")
const randomize = require("../random")
const qrcode = require("qrcode")
const urlModel = require("../model/urlModel")
const userModel = require("../model/userModel")
const urlRouter = express.Router();
const cacheExpress = require("express-api-cache")
const cache = cacheExpress.cache;


urlRouter.get('/autogenerate', (req,res) => {
    res.render('autogen', {
        check: false,
        email: req.user.email
    })
    
})
 
urlRouter.get('/custom', (req,res) => {
    res.render('custom', {
        check: false,
        email: req.user.email
    })
})


urlRouter.post("/autogenerate", async (req, res) => {
    const user = req.user
    const {fullurl} = req.body
    newLink = randomize()

    //create QRCODE
    qrcode.toDataURL(fullurl, async (err, src) => {
        if(err) res.send("Error occured")

        const url = await urlModel.create({fullurl, newLink, src, user: user.id})
        const link = await urlModel.findOne({newLink}).lean()
        userModel.links = url;
        userModel.save();  
        res.render('autogen', {
            check: true,
            src, 
            link,
            email: req.user.email

        })
    })
    
})

urlRouter.post("/custom", async(req, res)=> {
    const user = req.user
    const {fullurl, shorturl} = req.body
    const newLink = shorturl

    qrcode.toDataURL(fullurl, async (err, src) => {
        if(err) res.send("Error occured")

        await urlModel.create({fullurl, newLink, src, user: user.id})
        const link = await urlModel.findOne({newLink}).lean()

        res.render('custom', {
            check: true,
            src, 
            link,
            email: req.user.email
        })
    })

})

urlRouter.get("/history", cache("10 minutes"), async (req, res) => {
    const user = req.user
    let userFound= await urlModel.find().populate('user')
    console.log(userFound)
    // res.render("history", {
    //     allLinks: userFound,
    //     email 
    // })

}) 

module.exports = urlRouter