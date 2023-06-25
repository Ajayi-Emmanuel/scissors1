const {sign, verify} = require("jsonwebtoken")
require("dotenv").config()

const createToken =  (user)=> {
    const accessToken = sign(
        { 
            email: user.email, 
            id: user._id
        }, process.env.JWT_SECRET)
    
    return accessToken
}

const verifyToken = (req, res, next) => {
    // console.log(req.params)
    const accessToken = req.cookies["token"] 
     
    if(!accessToken) 
        return res.status(400).json({
            error: "User not Authenticated"
        })
    else{
        try{
            const validToken = verify(accessToken, process.env.JWT_SECRET)
            if(validToken){
                req.user = validToken;
                return next()
            }
        }catch(err){
            return res.status(400).json({error: err})
        }
    }

    
}



module.exports = {createToken, verifyToken}