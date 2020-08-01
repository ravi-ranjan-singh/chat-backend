const User = require("../../modals/user")


exports.getAllFriends = async (req, res) => {

    try {
        const user = await User.findById(req.userId)
        if (user) {

            let friends = user.friendList.filter(user => user.stage === "accepted")
            res.status(200).json(friends)
        }
        else
            res.status(200).json([])
    }
    catch (err) {
        res.status(400).json(err)
    }
}
1
3

exports.responseFreindRequest = async (req, res) => {
    const friendId = req.body.friendId;
    const senderId = req.body.senderId;
    const senderName = req.body.senderName
    const friendName = req.body.friendName
    const response = req.body.response

    if (response === true) {
        try {
            await User.updateOne({ _id: senderId }, {
                $set: { "friendList.$[friend].stage": "accepted", "friendList.$[friend].new": true }, $push: { "fastMessages": { recieverId: friendId, name: friendName, messages: [] } }
            }
                , {
                    arrayFilters: [{ "friend.friend_id": friendId }]
                })


            await User.updateOne({ _id: friendId }, {
                $set: { "friendList.$[friend].stage": "accepted" },
                $push: { "fastMessages": { recieverId: senderId, name: senderName, message: [] } }
            }
                , {
                    arrayFilters: [{ "friend.friend_id": senderId }]
                })

        }


        catch (err) {
            console.log(err)
        }
    }

    else {
        removeFriend(friendId, senderId)
        removeFriend(senderId, friendId)
    }

    res.sendStatus(200);

}


exports.getAllRequests = async (req, res) => {
    try {
        const friendList = await User.findById(req.userId).select(["friendList"])
        res.status(200).json(friendList)
    }

    catch (err) {

        res.status(400).json("Server Error")
    }
}


exports.getNewRequestsCount = async (req, res) => {
    try {
        const friendListInfo = await User.findById(req.userId).select(["friendList"])
        const newFriendRequets = Array.from(friendListInfo.friendList).filter(request => request.new === true)

        res.status(200).json(newFriendRequets.length)
    }

    catch (err) {

        res.status(400).json("Server Error")
    }
}

exports.getFriendRequestStatus = async (req, res) => {

    console.log(req.params)
    try {
        const friendListInfo = await User.findById(req.params.senderId).select(["friendList"])

        const friend = Array.from(friendListInfo.friendList.filter(user => user.friend_id == req.params.recieverId))
        console.log(friend)
        friend.length ? friend[0].stage === "accepted" ? res.status(200).json("friends") : res.status(200).json("friendRequestSent") : res.status(200).json("noFriends")
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }

}

exports.getOnlineFriends = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.friendList.length) {
            let friendsOnline = []
            for (var i in user.friendList) {
                const onlineFriend = await User.findOne({ _id: user.friendList[i].friend_id }).select(["name", "mobileNo", "email", "online"])
                if (onlineFriend) {
                    friendsOnline.push(onlineFriend)
                }
            }
            res.status(200).json(friendsOnline)
        }
        else {
            res.status(200).json(["no friends"])
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json("Server Error")
    }
}
exports.setRequestsSeenStatus = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, {
            $set: {
                "friendList.$[friend].new": false
            },
        }, {
            arrayFilters: [{ "friend.new": true }]
        })



        res.status(200).json("notifications updated 0")
    }
    catch (err) {
        console.log(err)
        res.json(err)
    }
}


//helper
async function removeFriend(senderId, recieverId) {
    console.log("deleting")


    try {
        await User.findByIdAndUpdate(senderId, {
            $pull: { friendList: { friend_id: recieverId } }
        })
    }
    catch (err) {
        console.log(err)
    }

}
