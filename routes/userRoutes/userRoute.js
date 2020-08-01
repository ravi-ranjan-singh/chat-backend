const express = require("express");
const userRouter = express.Router()

const authController = require("../../Controllers/authController")
const isAuthenticated = authController.isAuthenticated
const userController = require("../../Controllers/userController/userController")


userRouter
    .route("/")
    .get(isAuthenticated, userController.getUser)
    .patch(isAuthenticated, userController.updateUser)


userRouter.
    get("/name/:name", isAuthenticated, userController.getUserByName)


module.exports = userRouter
