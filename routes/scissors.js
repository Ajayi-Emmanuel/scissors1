const express = require("express")
const randomize = require("../random")
const qrcode = require("qrcode")
const urlModel = require("../model/urlModel")
const userModel = require("../model/userModel")
const urlRouter = express.Router();


urlRouter.get('/autogenerate', (req,res) => {
    res.render('autogen', {
        check: false
    })
    
})

urlRouter.get('/custom', (req,res) => {
    res.render('custom', {
        check: false
    })
})


urlRouter.post("/autogenerate", async (req, res) => {
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
            link
        })
    })
    
})

urlRouter.post("/custom", async(req, res)=> {
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

urlRouter.get("/history", async (req, res) => {
    // const allLinks = await urlModel.find()
    let allLinks = await userModel.find({email: user.email}).populate("links") 
    console.log(allLinks)
    res.render("history", {
        user,
        allLinks
    })

})

module.exports = urlRouter