const Activity = require('./../modals/activityModel');
const User = require('./../modals/user');
const Joi = require('@hapi/joi');


exports.getAllActivities = async (req, res, next) => {
  const activities = await Activity.find({}).sort({ 'votes.diff': -1 });
  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
};

exports.getActivity = async (req, res, next) => {
  console.log('here');
  const activity = await Activity.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      activity,
    },
  });
};

exports.addActivity = async (req, res, next) => {
  try {
    console.log(req.file)

    if (req.file) {
      let file = {
        Ftype: req.file.mimetype.split('/')[0],
        name: req.file.filename,
      };
      req.body.file = file;
    }
    if (!req.body.location) {
      req.body.location = {
        coordinates: ['77.206612', '28.524578'],
      };
    }
    if (req.body.votes) {
      req.body.votes.diff = req.body.votes.up - req.body.votes.down;
    }
    req.body.creator = "12345" || "req.userId";
    const activity = await Activity.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        activity,
      },
    });
  }
  catch (err) {
    res.status(400).json("Server Error")
    console.log(err)
  }
};

exports.updateActivity = async (req, res, next) => {
  console.log(req.userId);
  try {
    let activity = await Activity.findById(req.params.id);
    if (!(activity.creator === req.userId)) {
      return res.status(401).json({
        status: 'fail',
        msg: 'You are not authorized to delete this post',
      });
    }
    if (req.body.votes) {
      return res.status(401).json({
        status: 'fail',
        msg: 'Use another route for updating votes',
      });
    }
    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        activity,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Internal Server Error',
    });
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Activity not found',
      });
    }
    if (!(activity.creator === req.userId)) {
      return res.status(401).json({
        status: 'fail',
        msg: 'You are not authorized to delete this post',
      });
    }
    activity = await Activity.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Internal Server Error',
    });
  }
};

exports.getActivityWithin = async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lng, lat] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    console.log(error);
  }
  const activities = await Activity.find({
    'location.coordinates': {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
};

exports.changeVotes = async (req, res) => {
  const { id, type } = req.params;
  const user = await User.findById(req.userId);
  let activity;
  if (type == 1) {
    const postPresent = user.upvotedPost.includes(id);
    let index;
    if (!postPresent) {
      user.upvotedPost.push(id);
      index = user.downvotedPost.indexOf(id);
      if (index > -1) {
        user.downvotedPost.splice(index, 1);
      }
      await user.save({ runValidators: false });
      let ob = {
        votes: {},
      };
      ob.votes.up = req.body.up;
      ob.votes.down = req.body.down;
      ob.votes.diff = req.body.up - req.body.down;

      activity = await Activity.findByIdAndUpdate(id, ob, { new: true });
    }
  }
  if (type == -1) {
    const post = user.downvotedPost.includes(id);
    if (!post) {
      user.downvotedPost.push(id);
      index = user.upvotedPost.indexOf(id);
      if (index > -1) {
        user.upvotedPost.splice(index, 1);
      }
      await user.save({ runValidators: false });
      let ob = {
        votes: {},
      };
      ob.votes.up = req.body.up;
      ob.votes.down = req.body.down;
      ob.votes.diff = req.body.up - req.body.down;
      activity = await Activity.findByIdAndUpdate(id, ob, { new: true });
    }
  }
  res.status(200).json({
    status: 'success',
    activity,
  });
};


//Comments
exports.getAllComments = async (req, res) => {
  const { activity_id, count } = req.params
  try {
    const commentInfo = await Activity.findById(activity_id).select(["comments"])
    console.log(commentInfo)
    res
      .status(200)
      .json(commentInfo.comments.slice((count - 1) * 20, (count * 20) - 1))
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}


exports.postComment = async (req, res) => {
  try {
    console.log(req.body)

    await Activity.findByIdAndUpdate(req.params.activity_id, {
      $push: {
        comments: req.body
      }
    })

    res.json("Comment Added").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}


exports.deleteComment = async (req, res) => {
  const { activity_id, id } = req.params
  console.log(req.params)
  console.log(activity_id, id)
  try {
    await Activity.findByIdAndUpdate(activity_id, {
      $pull: {
        comments: { _id: id }
      }
    })

    res.json("Comment Deleted").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}


exports.deleteAllComments = async (req, res) => {
  const { activityId } = req.params
  try {
    await Activity.findByIdAndUpdate(activityId, {
      $set: {
        comments: []
      }
    })
    res.json("All Comments Deleted").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}

exports.updateComment = async (req, res) => {
  const { activity_id, id } = req.params
  console.log(activity_id, id, req.body.comment)

  try {
    await Activity.findByIdAndUpdate(activity_id, {
      $set: {
        "comments.$[comment].comment": req.body.comment
      }
    }, {
      arrayFilters: [{ "comment._id": id }]
    })
    res.json("Comment Updated").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}

exports.addReply = async (req, res) => {
  const { activity_id, id, reply_id } = req.params
  console.log(activity_id, id, reply_id)
  try {
    await Activity.findByIdAndUpdate(activity_id, {
      $push: {
        "comments.$[comment].replies": reply_id
      }
    }, {
      arrayFilters: [{ "comment._id": id }]
    })

    res.json("Reply Added").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}


exports.deleteReply = async (req, res) => {
  const { activity_id, id, reply_id } = req.params
  try {
    await Activity.findByIdAndUpdate(activity_id, {
      $pull: {
        "comments.$[comment].replies": reply_id
      }
    }, {
      arrayFilters: [{ "comment._id": id }]
    })
    res.json("Reply Deleted").status(200)
  } catch (err) {
    res.json("Server Error").status(400)
    console.log(err)
  }
}


