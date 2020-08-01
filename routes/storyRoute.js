const express = require('express');
const Upload = require('./../utils/multerSetup');
const storyController = require('../Controllers/storyController');
const authController = require('../Controllers/authController');

const router = express.Router();
const
    {
        getAllStoryFriends,
        getAllStoryUser,
        deleteStory,
        deleteAllStories,
        createStory
    } = storyController

//routes  

router.route("/friends/:user_id").get(getAllStoryFriends)

router.route("/:user_id").get(getAllStoryUser)

router.route("/stroy").post(createStory)

router.route("/story/:id").delete(deleteStory)

router.route("/:user_id").delete(deleteAllStories)


module.exports = router;
