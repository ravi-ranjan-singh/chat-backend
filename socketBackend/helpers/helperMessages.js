const User = require("../../modals/user")

//for offline messages
updateMessageOffline = async (senderId, recieverId, msgDetails, cId) => {

    let sender = false;
    let status = "present"

    await User.updateOne({ _id: recieverId }, {

        $push: {
            "offlineMessages": {
                senderId: senderId,
                sentTime: msgDetails.sentTime,
                messageText: msgDetails.messageText,
                sender: sender,
                status: status,
                commonId: cId
            }, upsert: true
        }
    })

}


//Send message to friend using socket.io and also save in database
const updateMessage = async (senderId, recieverId, msgDetails, acknowledge, socketId, io, cId, seenStatus) => {
    let sender = false;
    let status = null
    if (senderId === msgDetails.senderId)
        sender = true;
    if (msgDetails.status)
        status = msgDetails.status

    await User.updateOne({ _id: senderId }, {

        $push: {
            "fastMessages.$[reciever].messages": {
                sentTime: msgDetails.sentTime,
                messageText: msgDetails.messageText,
                sender: sender,
                status: status,
                commonId: cId



            }
        }
    }, {
        "arrayFilters": [{ "reciever.recieverId": recieverId }]
    })


    if (acknowledge) {
        console.log("pcbmn", msgDetails)
        io.to(socketId).emit("privateMessageResponse", msgDetails)

    }
    else {
        console.log("pcbmr", msgDetails)
        io.to(socketId).emit("privateMessageBackend", msgDetails)
    }



}


//to update the response (seen,delivered) to frontend also using socket and save in database also(backend work)

const updateMessageResponse = async (senderId, recieverId, msgDetails, acknowledge, socketId, io, cId, seenStatus) => {
    console.log("response", msgDetails, acknowledge)
    let sender = false;
    let status = null
    if (senderId === msgDetails.senderId)
        sender = true;
    if (msgDetails.status)
        status = msgDetails.status

    let user = await User.findOne({ _id: senderId })
    user.saved = user.saved ? false : true


    user.fastMessages.forEach((messageInfo, i) => {

        if (messageInfo.recieverId == recieverId) {

            messageInfo.messages.forEach((message, j) => {
                message = message.toObject()


                if (message.commonId == cId) {

                    message.status = status

                    user.fastMessages[i].messages[j] = { ...message }
                }


            })
        }

    })
    try {
        await user.save()

    }
    catch (err) {
        console.log("err", err.message)

    }




    if (acknowledge) {
        msgDetails.status = status

        io.to(socketId).emit("privateMessageResponse", msgDetails)

    }


}


module.exports = { updateMessage: updateMessage, updateMessageOffline: updateMessageOffline, updateMessageResponse }


