const authController = require('./../Controllers/authController');
const router = require('express').Router();

router.post('/generate-otp', authController.generateOTP);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
