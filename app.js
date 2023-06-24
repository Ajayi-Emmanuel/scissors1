const express = require("express")
require("dotenv").config()
const urlModel = require("./model/urlModel")
const {connectToDb} = require("./db")

const app = express();
const PORT = process.env.PORT || 3000;

connectToDb()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public')) 

const {verifyToken} = require("./middleware")
const userRoute = require('./routes/user')
const urlRoute = require('./routes/scissors')

app.set('view engine', 'ejs')
app.use('/', userRoute)
app.use('/scissors', verifyToken, urlRoute)

app.get('/', (req,res)=> {
    res.render("login", {
        error: false
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

app.listen(PORT, () => { 
    console.log(`App listening at http://localhost:${PORT}`);
}) 