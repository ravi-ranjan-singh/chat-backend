const User = require("../../modals/user")
const { updateMessage } = require("./helperMessages")
const decryptId = require("../../utils/decryptId")


module.exports = connections = (socket, io) => {
    socket.on("newUser", async (user) => {
        user._id = decryptId(user._id)
        try {

            await User.findOne({ _id: user._id })
                .updateOne({ socketId: socket.id, online: { status: true, lastSeen: Date.now() } })

            let newUser = await User.findOne({ _id: user._id })


            //if any offline messages exists this will automatically executes and send the messages to the user.
            if (newUser)
                newUser.offlineMessages.forEach(async msgDetails => {

                    msgDetails = msgDetails.toObject()
                    msgDetails.status = "recieved"

                    msgDetails.recieverId = user._id
                    let msg = msgDetails
                    updateMessage(msg.recieverId, msg.senderId, msg, 0, socket.id, io)

                    await User.updateOne({ _id: user._id }, {
                        $pull: {
                            "offlineMessages": {
                                _id: msgDetails._id
                            }
                        }

                    })


                })

        }
        catch (err) { console.log(err) }

    })

    socket.on("disconnect", async (msg) => {

        await User.updateOne(
            {
                socketId: socket.id
            }, { socketId: 0, online: { status: false, lastSeen: Date.now() } }
        )
    })
}
