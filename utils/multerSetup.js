const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];

    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
