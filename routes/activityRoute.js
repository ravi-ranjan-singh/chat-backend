const express = require('express');
const Upload = require('./../utils/multerSetup');
const activityController = require('../Controllers/activityController');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(
    Upload.single('activityFile'),
    //authController.isAuthenticated,
    activityController.addActivity
  );

router.patch(
  '/:id/votes/:type',
  //authController.isAuthenticated,
  activityController.changeVotes
);
// router
//   .route('/:id')
//   .get(activityController.getActivity)
//   .patch(authController.isAuthenticated, activityController.updateActivity)
//   .delete(authController.isAuthenticated, activityController.deleteActivity);

// router.get(
//   '/activities-within/:distance/center/:latlng/unit/:unit',
//   activityController.getActivityWithin
// );

//Comments Route
router.get('/comments/:activity_id/:count', activityController.getAllComments)

router.route('/comments/:activity_id/:id')
  .delete(activityController.deleteComment)
  .patch(activityController.updateComment)


router.route('/comments/:activity_id')
  .post(activityController.postComment)
  .delete(activityController.deleteAllComments)

router.route('/comments/reply/:activity_id/:id/:reply_id')
  .post(activityController.addReply)
  .delete(activityController.deleteReply)




module.exports = router;
