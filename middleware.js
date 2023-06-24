const {sign, verify} = require("jsonwebtoken")
require("dotenv").config()

const createToken =  (user)=> {
    const accessToken = sign(
        { 
            email: user.email, 
        }, 
        process.env.JWT_SECRET)
    
    return accessToken
}

const verifyToken = (req, res, next) => {

    // const accessToken = req.cookie['']
    console.log(res.body) 
    // console.log(req.Cookie)  
    
    // if(!accessToken) 
    //     return res.status(400).json({
    //         error: "User not Authenticated"
    //     })
    // else{
    //     try{
    //         const validToken = verify(accessToken, process.env.JWT_SECRET)
    //         if(validToken){
    //             req.email = validToken.email;
    //             return next()
    //         }
    //     }catch(err){
    //         return res.status(400).json({error: err})
    //     }
    // }

    
}



module.exports = {createToken, verifyToken}