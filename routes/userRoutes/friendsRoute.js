const express = require("express")
const friendsRouter = express.Router();
const authController = require("../../Controllers/authController")
const friendsContoller = require("../../Controllers/userController/friendsContoller")

const isAuthenticated = authController.isAuthenticated

const
    {
        getAllFriends,
        getAllRequests,
        responseFreindRequest,
        getNewRequestsCount,
        getFriendRequestStatus,
        getOnlineFriends,
        setRequestsSeenStatus
    }
        = friendsContoller


friendsRouter
    .get("/", isAuthenticated, getAllFriends)

    .get("/requests", isAuthenticated, getAllRequests)

    .get("/new-requests-count", isAuthenticated, getNewRequestsCount)

    .get("friend/status/:senderId/:recieverId", isAuthenticated, getFriendRequestStatus)

    .get("/online", isAuthenticated, getOnlineFriends)

    .post("/set-requests-status", isAuthenticated, setRequestsSeenStatus)

    .post("/response-request", isAuthenticated, responseFreindRequest)


module.exports = friendsRouter