const {sign, verify} = require("jsonwebtoken")
require("dotenv").config()

/**
 * 
 * @param {*} user 
 * @returns
 * @description This function creates a JWT token for the user
 * @example
 * createToken(user)
 * // returns 'a1b2c3d4e5'
 */
const createToken =  (user)=> {
    const accessToken = sign(
        { 
            email: user.email, 
            id: user._id
        }, process.env.JWT_SECRET)
    
    return accessToken
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description This function verifies the JWT token for the user
 * @example
 * verifyToken(req, res, next)
 * // returns 'a1b2c3d4e5'
 * @throws Will throw an error if the token is invalid
 * @throws Will throw an error if the token is not present
 * @throws Will throw an error if the token is expired
 * @throws Will throw an error if the token is malformed
 * @throws Will throw an error if the token is not active
 * @throws Will throw an error if the token is not yet valid
 * @throws Will throw an error if the token is not yet active
*/
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