'use strict';

const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3
} = require('../services/upload.service');
const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromUrl()
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      return next(new BadRequestError('File missing'));
    }
    new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocal({
        path: file.path
      })
    }).send(res);
  };

  // uploadFileFromLocal = async (req, res, next) => {
  //   const { files } = req;
  //   if (!files || !files.length) {
  //     return next(new BadRequestError('Please upload file'));
  //   }
  //   new SuccessResponse({
  //     message: 'Upload file successfully',
  //     metadata: await uploadImageFromLocal({
  //       files
  //     })
  //   }).send(res);
  // };

  // uploadFileFromUrl = async (req, res, next) => {
  //   const { url } = req.body;
  //   if (!url) {
  //     return next(new BadRequestError('Please upload file'));
  //   }
  //   new SuccessResponse({
  //     message: 'Upload file successfully',
  //     metadata: await uploadImageFromUrl({
  //       url
  //     })
  //   }).send(res);
  // };
  // uploadFileFromUrlV2 = async (req, res, next) => {
  //   const { url } = req.body;
  //   if (!url) {
  //     return next(new BadRequestError('Please upload file'));
  //   }
  //   new SuccessResponse({
  //     message: 'Upload file successfully',
  //     metadata: await uploadImageFromUrl({
  //       url
  //     })
  //   }).send(res);
  // };

  uploadImageFromLocalFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      return next(new BadRequestError('File missing'));
    }
    new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocalFiles({
        files
      })
    }).send(res);
  };

  // use S3
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      return next(new BadRequestError('File missing'));
    }
    new SuccessResponse({
      message: 'Upload file successfully use S3Client',
      metadata: await uploadImageFromLocalS3({
        file
      })
    }).send(res);
  };
}

module.exports = new UploadController();
