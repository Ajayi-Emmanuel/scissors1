const {sign, verify} = require("jsonwebtoken")
require("dotenv").config()
const cookies = require("cookie-parser")

const createToken =  (user)=> {
    const accessToken = sign(
        { 
            email: user.email, 
        }, 
        process.env.JWT_SECRET)
    
    return accessToken
}

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies['token']
    console.log(accessToken)
    // if(!accessToken) 
    //     return res.status(400).json({
    //         error: "User not Authenticated"
    //     })
    // else{
    //     try{
    //         const validToken = verify(accessToken, process.env.JWT_SECRET)
    //         if(validToken){
    //             req.authenticated = true
    //             req.email = validToken.email;
    //             return next()
    //         }
    //     }catch(err){
    //         return res.status(400).json({error: err})
    //     }
    // }

    
}



module.exports = {createToken, verifyToken}