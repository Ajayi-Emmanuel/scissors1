const randomize = require("../random")
const qrcode = require("qrcode")
const urlModel = require("../model/urlModel")
const userModel = require("../model/userModel")
const cacheExpress = require("express-api-cache")
const cache = cacheExpress.cache;
const urlChecker = require("is-url")

/**
 * @swagger
 * /autogenerate:
 *  get:
 *    description: Use to render the autogenerate page
 *    responses:
 *     '200':
 *       description: A successful response
 *     '403':
 *       description: A failed response
 */
exports.getAutogeneratePage = (req,res) => {
    res.render('autogen', {
        check: false,
        error: false,
        email: req.user.email
    })
    
}

/**
 * @swagger
 * /custom:
 *  get:
 *   description: Use to render the custom page
 *   responses:
 *     '200':
 *        description: A successful response
 *     '403':
 *        description: A failed response
 */
exports.getCustomPage = (req,res) => {
    res.render('custom', {
        check: false,
        error: false,
        email: req.user.email
    })
}

/**
 * @swagger
 * /autogenerate:
 *  post:
 *   description: Use to autogenerate a short url
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *          type: object
 *          properties:
 *             fullurl:
 *               type: string
 *               description: The url to be shortened
 *               example: https://www.google.com
 *  responses:
 *   '200':
 *    description: A successful response
 *   '403':
 *      description: A failed response
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      check:
 *                          type: boolean
 *                          description: The status of the request
 *                          example: true
 *                      error:
 *                          type: string
 *                          description: The error message
 *                          example: Invalid URL
 *                      src:
 *                          type: string
 *                          description: The qrcode of the url
 *                          example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA
 *                      newLink:
 *                          type: string
 *                          description: The shortened url
 *                          example: 5f8b1
 *                      email:
 *                          type: string
 *                          description: The email of the user
 *                          example: "hello@gmail.com"
 */

exports.autogenerate = async (req, res) => {
    const user = req.user
    const {fullurl} = req.body
    if(!urlChecker(fullurl)) {
        res.status(403)
        res.render('autogen', {
            email: req.user.email,
            check: false,
            error: "Invalid URL"
        })
    }else{
        newLink = randomize()
        //create QRCODE
        qrcode.toDataURL(fullurl, async (err, src) => {
            if(err) res.send("Error occured")

            try {
                const url = await urlModel.create({fullurl, newLink, src, user: user.id})
            
                const userFound = await userModel.findOne({email: user.email})
                userFound.links.push(url)
                userFound.save()

                res.render('autogen', {
                    check: true,
                    error: false,
                    src, 
                    newLink,
                    email: req.user.email
        
                })
            } catch (err) {
                if (err.code === 11000) {
                    res.status(403)
                    res.render('autogen', {
                        email: req.user.email,
                        check: false,
                        error: "Check your history; Link has been shortened!"
                    })
                }
            }
        })

    }    
    
}


/**
 * @swagger
 * /custom:
 *  post:
 *    description: Use to custom a short url
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             fullurl:
 *               type: string
 *               description: The url to be shortened
 *               example: https://www.google.com
 *             shorturl:
 *               type: string
 *               description: The custom url
 *               example: google
 *  responses:
 *    '200':
 *      description: A successful response
 *    '403':
 *      description: A failed response 
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                check:
 *                  type: boolean
 *                  description: The status of the request
 *                  example: true
 *                error:
 *                  type: string
 *                  description: The error message
 *                  example: Invalid URL
 *                src:
 *                  type: string
 *                  description: The qrcode of the url
 *                  example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA
 *                newLink:
 *                  type: string
 *                  description: The shortened url
 *                  example: 5f8b1
 *                email:
 *                  type: string
 *                  description: The email of the user
 *                  example: "hello@gmail.com"
 */

exports.custom = async(req, res)=> {
    const user = req.user
    const {fullurl, shorturl} = req.body
    if(!urlChecker(fullurl)) {
        res.status(403)
        res.render('custom', {
            email: req.user.email,
            check: false,
            error: "Invalid URL"
        })
    }else{
        const newLink = shorturl

        qrcode.toDataURL(fullurl, async (err, src) => {
            if(err) res.send("Error occured")

            try {
                const url = await urlModel.create({fullurl, newLink, src, user: user.id})

                const userFound = await userModel.findOne({email: user.email})
                userFound.links.push(url)
                userFound.save()

                res.render('custom', {
                    check: true,    
                    error: false,
                    src, 
                    newLink,
                    email: req.user.email
                })
            } catch (err) {
                if (err.code === 11000) {
                    res.status(403)
                    res.render('custom', {
                        email: req.user.email,
                        check: false,
                        error: "Check your history; Link has been shortened!"
                    })
                }
            }
    
        })
    }
}

/**
 * @swagger
 * /history:
 *  get:
 *    description: Use to get the history of shortened urls
 *    responses:
 *     '200':
 *        description: A successful response
 *        content:
 *         application/json:
 *            schema:
 *             type: object
 *             properties:
 *              allLinks:
 *               type: array
 *               description: The list of shortened urls
 *               example: [{fullurl: "https://www.google.com", newLink: "5f8b1", src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA", user: "5f8b1"}]
 *             email:
 *              type: string
 *              description: The email of the user
 *              example: "hello@gmail.com"
 *     '403':
 *        description: A failed response
 */

exports.getHistory = async (req, res) => {
    const user = req.user
    let allLinks= await userModel.findOne({email: user.email}).populate('links')

    res.render("history", {
        allLinks: allLinks.links,   
        email: req.user.email,
        test: false,   
    })
    
}

exports.getAnalytics = async (req, res) => {
    const user = req.user
    let allLinks= await userModel.findOne({email: user.email}).populate('links')

    const short = req.params.shortid.split(':');
    shortid = short[1]
    urlDetails = await urlModel.findOne({newLink: shortid})

    if (!urlDetails) return res.status(404);

    
    res.render("history", {
        allLinks: allLinks.links,   
        email: req.user.email,
        test: true,   
        url: urlDetails
    })
}