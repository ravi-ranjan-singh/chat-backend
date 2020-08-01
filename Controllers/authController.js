const User = require('../modals/user');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const AuthTable = require('./../modals/authModel');
const Cryptor = require('cryptr');
const cryptr = new Cryptor('myTotalySecretKey');

exports.isAuthenticated = async (req, res, next) => {
  try {
    let id;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      id = req.headers.authorization.split(' ')[1];
    }
    id = cryptr.decrypt(id);
    if (!id) {
      console.log(id, "idauth");
      return res.status(401).json({
        status: 'fail',
        msg: 'Please login to access the resource',
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        msg: 'Please login to access the resource',
      });
    }
    req.userId = id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      msg: 'Please login to access the resource',
    });
  }
};

exports.generateOTP = async (req, res) => {
  const user = (await AuthTable.find({ mobileNo: req.body.mobileNo }))[0];
  if (user) {
    await AuthTable.findByIdAndDelete(user.id);
  }
  const otp = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
    digits: true,
  });
  let msg = `Your OTP for login is : ${otp} .It is only valid for 5 minutes.\nTo keep your account safe, never forward this code.\n${new Date().toLocaleTimeString()}`;
  let senderId = 'CAMPRG';
  let authKey = process.env.auth_key;
  console.log(authKey, "wu");
  const url = ` http://roundsms.com/api/sendhttp.php?authkey=${authKey}&mobiles=${req.body.mobileNo}&message=${msg}&sender=${senderId}&type=1&route=2`;

  const response = await axios.get(url);
  console.log(response.data.error)
  if (response.data.error != 'null') {
    let ob = { ...req.body };
    ob.otp = otp;
    ob.otpExpiresIn = Date.now() + 5 * 60 * 1000 + 10000;
    await AuthTable.create(ob);
    return res.status(200).json({
      status: 'success',
      msg: 'OTP sent to Phone',
    });
  }
  res.status(500).json({
    status: 'fail',
    msg: 'Internal Server Error',
  });
};

exports.verifyOTP = async (req, res) => {
  let ob = { ...req.body };


  const user = (await AuthTable.find(ob))[0];
  if (user) {
    let d1, d2;
    d1 = user.otpExpiresIn.getTime();
    d2 = new Date().getTime();
    let diff = (d1 - d2) / (1000 * 60);
    if (diff > 0) {
      let newUser = (await User.find({ mobileNo: ob.mobileNo }))[0];
      if (!newUser) {
        newUser = await User.create(ob);
      }
      let id = cryptr.encrypt(newUser.id);
      await AuthTable.findByIdAndDelete(user.id);
      return res.status(200).json({
        status: 'success',
        id,
      });
    }
    await AuthTable.findByIdAndDelete(user.id);
    return res.status(401).json({
      status: 'fail',
      msg: 'OTP verification failed',
    });
  }
  res.status(401).json({
    status: 'fail',
    msg: 'OTP verification failed',
  });
};
