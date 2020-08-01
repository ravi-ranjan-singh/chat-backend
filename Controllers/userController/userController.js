const User = require("../../modals/user")

exports.getUser = async (req, res) => {
    console.log(req.userId)
    res.status(200).json(
        await User.findById(req.userId, { _id: 0 }).select(["mobileNo", "name", "online"])
    )
}

exports.updateUser = async (req, res) => {
    console.log(req.params)
    try {
        const userDetails = req.body
        const users = await User.findByIdAndUpdate(req.userId, { ...userDetails })
        console.log(users)
        res.status(200).json("User updated")

    }

    catch (err) {
        res.status(404).json({ err: "No User Or Server Error" })
    }

}


exports.getUserByName = async (req, res) => {
    console.log(req.params)
    try {
        let value = new RegExp(req.params.name, 'i')

        const users = await User.find({ name: value }).select(["name", "email", "_id"])
        console.log(users)
        res.status(200).json(users)

    }

    catch (err) {
        res.status(404).json({ err: "No User Or Server Error" })
    }

}