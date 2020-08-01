const express = require("express");
const messagesRouter = express.Router();
const authController = require("../Controllers/authController")
const messagesController = require("../Controllers/userController/messagesController")

const isAuthenticated = authController.isAuthenticated

const {
    getMessages,
    getOfflineMessages,
    getChats,
    deleteAllMessages,
    sendFileMessage, updateChats
} = messagesController




messagesRouter
    .route("/")
    .get(isAuthenticated, getMessages)
    .delete(isAuthenticated, deleteAllMessages)

messagesRouter.
    get("/offline-messages", isAuthenticated, getOfflineMessages)

messagesRouter
    .route("/chats")
    .get(isAuthenticated, getChats)
    .post(isAuthenticated, updateChats)

messagesRouter.post('/message/file', isAuthenticated, sendFileMessage)

//message-file is not fully ready...


module.exports = messagesRouter

