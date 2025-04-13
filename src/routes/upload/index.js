'use strict';

const express = require('express');
const uploadController = require('../../controller/upload.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');

// router.user(authenticationV2);
router.post('/product', asyncHandler(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb));
router.post('/product/multiple', uploadDisk.array('file', 3), asyncHandler(uploadController.uploadImageFromLocalFiles));

// upload S3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3));

module.exports = router;
