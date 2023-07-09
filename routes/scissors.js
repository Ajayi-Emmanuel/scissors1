const express = require("express")
const urlRouter = express.Router();

scissorsController = require("../controllers/scissorsController")


urlRouter.get('/autogenerate', scissorsController.getAutogeneratePage)
 

urlRouter.get('/custom', scissorsController.getCustomPage)



urlRouter.post("/autogenerate", scissorsController.autogenerate)


urlRouter.post("/custom", scissorsController.custom)



urlRouter.get('/:shortid', scissorsController.redirectToFullUrl )


urlRouter.get("/history", scissorsController.getHistory )

urlRouter.get("/history/analytics/:shortid", scissorsController.getAnalytics)


module.exports = urlRouter