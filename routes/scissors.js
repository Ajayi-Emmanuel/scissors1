const express = require("express")
const randomize = require("../random")
const qrcode = require("qrcode")
const urlModel = require("../model/urlModel")
const userModel = require("../model/userModel")
const urlRouter = express.Router();


urlRouter.get('/autogenerate', (req,res) => {
    res.render('autogen', {
        check: false,
        email: req.email
    })
    
})

urlRouter.get('/custom', (req,res) => {
    res.render('custom', {
        check: false,
        email: req.email
    })
})


urlRouter.post("/autogenerate", async (req, res) => {
    const email = req.email
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
            link,
            email

        })
    })
    
})

urlRouter.post("/custom", async(req, res)=> {
    const email = req.email
    const {fullurl, shorturl} = req.body
    const newLink = shorturl

    qrcode.toDataURL(fullurl, async (err, src) => {
        if(err) res.send("Error occured")

        await urlModel.create({fullurl, newLink, src})
        const link = await urlModel.findOne({newLink}).lean()

        res.render('custom', {
            check: true,
            src, 
            link,
            email
        })
    })

})

urlRouter.get("/history", async (req, res) => {
    const email = req.email
    let userFound= await userModel.find({email: email}).populate("links")
    // res.json({userFound})
    console.log(userFound)
    // res.render("history", {
    //     allLinks,
    //     email
    // })

}) 

module.exports = urlRouter