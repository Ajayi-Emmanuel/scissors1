const userRoute = require("express").Router();

const userController = require("../controllers/userController")


userRoute.get('/signup', userController.getSignupPage)

userRoute.get('/login', userController.getLoginPage)


userRoute.post('/signup', userController.signup)


userRoute.post("/login", userController.login)


module.exports = userRoute