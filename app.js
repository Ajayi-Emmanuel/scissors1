const express = require("express")
require("dotenv").config()
const urlModel = require("./model/urlModel")
const {connectToDb} = require("./db")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const ip = require("ip")


const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Scissors API",
        version: "1.0.0",
        description: "This is an API application made with Express and documented with Swagger. It is a URL shortener application.",
        contact: {
            name: "Ajayi Emmanuel"
        },
        servers: ["https://mern-hnu2.onrender.com"],
        description: "This is an API application made with Express and documented with Swagger. It is a URL shortener application."
    }
}


const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJsDoc(options)


const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again in an hour"
})

connectToDb()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(limiter)
app.use(cookieParser())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.static(__dirname + '/public')) 

const {verifyToken} = require("./middleware")
const userRoute = require('./routes/user')
const urlRoute = require('./routes/scissors')


app.set('view engine', 'ejs')
app.use('/', userRoute)
app.use('/scissors', verifyToken, urlRoute)

/**
 * @swagger
 * /:
 *  get:
 *   summary: Loads the login page
 *   responses:
 *     '200':
 *         description: Loads the login page
 *     '404':
 *         description: Page not found
 */
app.get('/', (req,res)=> {
    res.render("login", {
        error: false
    })
})

/**
 * @swagger
 * /:
 *   get:
 *    summary: Loads the page from the shortened URL
 *   responses:
 *      '200':
 *          description: Redirect page from the shortened URL to the original URL
 *     '404':
 *          description: Page not found
 */
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