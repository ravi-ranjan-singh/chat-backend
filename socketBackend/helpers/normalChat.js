const User = require("../../modals/user")
const { updateMessage, updateMessageOffline, updateMessageResponse } = require("./helperMessages")
const uniqid = require("uniqid")
const decryptId = require("../../utils/decryptId")

module.exports = normalMessages = (socket, io) => {
    socket.on("privateMessage", async (msgDetails) => {
        try {
            const privateUser = await User.findOne({ _id: msgDetails.recieverId })
            const commonId = uniqid()
            msgDetails.commonId = commonId
	        msgDetails.senderId = decryptId(msgDetails.senderId)
            let msgDetails2 = msgDetails
            msgDetails2.status = "sent"
            console.log("privateMessage", msgDetails)
            const sender = await User.findOne({ _id: msgDetails.senderId })
            updateMessage(msgDetails2.senderId, msgDetails2.recieverId, msgDetails2, 1, sender.socketId, io, commonId)

            if (privateUser.socketId != 0) {
                console.log("present running", msgDetails2)
                msgDetails = { ...msgDetails, status: "recieved" }

                updateMessage(msgDetails.recieverId, msgDetails.senderId, msgDetails, 0, privateUser.socketId, io, commonId)



            }

            else {
                console.log("not present running")
                msgDetails = { ...msgDetails, status: "present" }

                updateMessageOffline(msgDetails.senderId, msgDetails.recieverId, msgDetails, commonId)

            }
        }
        catch (err) {
            console.log(err)
        }


    })

	socket.on("updateSeenStatus", async (ids) => {
	try {
	    ids._id = decryptId(ids._id)
	    const user = await User.findOne({_id: ids.receiver_id})
	    const user2 = await User.findOne({_id: ids._id})
	    user2.chats.forEach(user1 => {
		if (user1.userId == ids.receiver_id) {
		    user1.unseenCount = 0
		}
	    })
	    user2.save()
	    socket.emit("updateChats", ids)
	    user.fastMessages.forEach(user1 => {
		if (user1.recieverId == ids._id) {
		    for (var i = user1.messages.length-1; i >= 0; i--) {
			if (user1.messages[i].status == "seen") {
			    break;
			}
			else {
			    if (user1.messages[i].sender == true) {
				user1.messages[i].status = "seen"
			    }
			}
		    }
		}
	    })
	    user.save()
	}
	catch(err) {
	    console.log(err)
	}
    })
	
    //for acknowledgements, when message sent to the friend and acknowledgement like delivered or seen will be setup.

    socket.on("privateMessageResponseBackend", async (msgDetails) => {
        try {
            // msgDetails.senderId = decryptId(msgDetails.senderId)
            const sender = await User.findOne({ _id: msgDetails.senderId })
            msgDetails.status = msgDetails.seenStatus || "delivered"
            console.log(msgDetails, "privateMessageResponseBackend-2")


            if (msgDetails.status == "delivered") {
                updateMessageResponse(msgDetails.senderId, msgDetails.recieverId, msgDetails, 1, sender.socketId, io, msgDetails.commonId)

                msgDetails.status = "recieved"

                updateMessageResponse(msgDetails.recieverId, msgDetails.senderId, msgDetails, 0, null, null, msgDetails.commonId)
            }

            else

                if (msgDetails.seenStatus) {
                    updateMessageResponse(msgDetails.recieverId, msgDetails.senderId, msgDetails, 0, null, null, msgDetails.commonId)

                    updateMessageResponse(msgDetails.senderId, msgDetails.recieverId, msgDetails, 1, sender.socketId, io, msgDetails.commonId)


                }
        }
        catch (err) {
            console.log(err)
        }

    })

    //socket event for friend requests
    socket.on("newFriendRequest", async (details, cb) => {

        const { friendId, senderId } = details

        senderId = decryptId(senderId)
        try {

            const user = await User.findById(senderId)
            user.friendList.forEach(user => {
                console.log(user)
                if (user.friend_id == friendId)
                    throw new Error("user already exists")

            })
            const socketId = await User.findById(friendId).select(["socketId"])
            console.log(socketId.socketId)

            //if user is online
            if (socketId) {
                io.to(socketId.socketId).emit("newFriendRequestFromBackend", { friend_id: senderId, name: details.senderName, sender: false, stage: 'recieved', email: details.senderEmail, new: true })


            }
            //set backend of friend
            await User.findByIdAndUpdate(friendId, {
                $push: { friendList: { friend_id: senderId, name: details.senderName, sender: false, stage: 'recieved', email: details.senderEmail, new: true } },

            })
            console.log("here")
            cb({ friend_id: friendId, name: details.friendName, status: false, sender: true, stage: 'sent', email: details.friendEmail, new: true })

            await User.findByIdAndUpdate(senderId, {
                $push: { friendList: { friend_id: friendId, name: details.friendName, status: false, sender: true, stage: 'sent', email: details.friendEmail, new: true } },

            })
        }
        catch (err) {
            console.log(err)

        }



    })
}
 