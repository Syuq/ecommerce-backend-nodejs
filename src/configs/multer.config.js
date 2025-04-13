'use strict';

const multer = require('multer');

const uploadMemory = multer({
  storage: multer.memoryStorage()
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

const uploadCloudinary = multer({
  storage: multer.memoryStorage()
});

const uploadS3 = multer({
  storage: multer.memoryStorage()
});

const uploadLocal = multer({
  storage: multer.memoryStorage()
});

const uploadLocalFiles = multer({
  storage: multer.memoryStorage()
});

module.exports = {
  uploadMemory,
  uploadDisk,
  uploadCloudinary,
  uploadS3,
  uploadLocal,
  uploadLocalFiles
};
