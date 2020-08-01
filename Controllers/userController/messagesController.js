const User = require("../../modals/user")
const upload = require("../../utils/multerSetup")


exports.getMessages = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        if (user)
            res.status(200).json(user.fastMessages)
    }
    catch (err) {
        console.log(err)
        res.status(400).json("Server Error")
    }
}

exports.getOfflineMessages = async (req, res) => {
    try {


        const id = req.userId;
        let offlineMessages = await User.find({ _id: id }).select(["offlineMessages"])
        console.log("ll")
        res.status(200).json(offlineMessages)
    }
    catch (err) {
        res.status(400).json("error")
    }
}


exports.getChats = async (req, res) => {
    try {



        let chats = await User.findById(req.userId).select(["chats"])

        res.status(200).json(chats)
    }
    catch (err) {
        res.status(400).json("error")
    }

}

exports.updateChats = async (req, res) => {
    try {
        const chats = req.body

        await User.updateOne({ _id: req.userId }, {
            $set: {
                chats: chats
            }
        })

        res.status(200).json("Updated")
    }
    catch (err) {
        console.log(err)
        res.status(400).json("failed")
    }



}

exports.deleteAllMessages = async (req, res) => {
    console.log(req.body)
    try {


        const userId = req.userId;
        const chatId = req.params.chatId

        await User.updateOne({ _id: userId }, {
            $set: {
                "fastMessages.$[user].messages": []
            }
        }, {
            arrayFilters: [{ "user.recieverId": chatId }]
        })

        res.status(200).json("Updated")
    }
    catch (err) {
        console.log(err)
        res.status(400).json("failed")
    }



}

exports.sendFileMessage = upload.single('file-message'), (req, res) => {
    console.log(req.file)
    res.status(200).json({
        status: 'success',
        data: {
            message: 'upload successful',
            imgName: req.file.filename,
        },
    });
}

