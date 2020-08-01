const Story = require("./../modals/activityModel")
const User = require("./../modals/user")



exports.getAllStoryFriends = async (req, res) => {


    try {
        const friendListInfo = User.findById(req.params.user_id).select(["friendList"])

        let friendsWithStory = []

        friendListInfo.friendList.forEach(friend => {
            if (friend.story.isStory === true)
                friendsWithStory.push(friend)
        })

        let storyInfo = {}
        let stories = []
        friendsWithStory.forEach(async (friend) => {

            const story = await Story.find({
                writer: friend.friend_id
            }).sort(["Date"])
                .skip(0)
                .limit(1)

            storyInfo = {
                story: story,
                friend_id: friend.friend_id,
                storyCount: friend.story.storyCount
            }
            stories.push(storyInfo)



        })



        res.json(stories)
            .status(200)
    }

    catch (err) {
        console.log(err)
        res.send("Server Error").status(400)

    }


}

exports.getAllStoryUser = async (req, res) => {

    try {
        const stories = await Story.find({
            writer: req.params.user_id
        })
            .sort(["Date"])


        res.json(stories)
            .status(200)
    } catch (err) {
        console.log(err)
        res.send("Server Error").status(400)

    }


}

exports.createStory = async (req, res) => {

    try {
        let newStory = req.body
        await new Story(newStory).save()

        res.json("Story created successfully")
            .status(200)
    } catch (err) {
        console.log(err)
        res.send("Server Error").status(400)

    }


}


exports.deleteStory = async (req, res) => {

    try {

        await Story.findByIdAndRemove(req.params.id)


        res.json("Story deleted successfully")
            .status(200)
    } catch (err) {
        console.log(err)
        res.send("Server Error").status(400)

    }


}


exports.deleteAllStories = async (req, res) => {

    try {

        await Story.remove({ writer: req.params.writer.user_id })


        res.json("All Stories deleted successfully")
            .status(200)
    } catch (err) {
        console.log(err)
        res.send("Server Error").status(400)

    }


}



