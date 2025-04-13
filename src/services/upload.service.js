'use strict';

const { publicDecrypt } = require('crypto');
const { populate } = require('dotenv');
const { thru, fromPairs, result } = require('lodash');
const { s3, PutObjectCommand } = require('../configs/s3.config');

/// upload file use S3Client ///

// 4. upload from image local
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname || 'unknown',
      Body: file.buffer,
      ContentType: 'image/jpeg' // that is what you need!
    });

    const result = await s3.send(command);

    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 6699,
      thumb_url: await cloudinary.url(result.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
        format: 'jpg'
      })
    };
  } catch (error) {
    console.log('Error uploading image using S3Client::', error);
  }
};

// END S3 Service ///

// 1. upload form url image
const uploadImageFromUrl = async () => {
  try {
    const urlImage = 'https://cdn.shopify.com/s/files/1/0262/5951/4064/products/IMG_20230908_153905.jpg?v=1694165306';
    const folderName = 'product/9999',
      newFileName = 'test.jpg';

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log('Error uploading image from URL:', error);
  }
};

// 2. upload from local image
const uploadImageFromLocalFiles = async ({ path, folderName = 'product/6699' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 6699
    };
  } catch (error) {
    console.log('Error uploading image from local files:', error);
    throw error;
  }
};

// 3. upload from image local
const uploadImageFromLocal = async ({ files, folderName = 'product/6699' }) => {
  try {
    console.log(`files::`, files, folderName);
    if (!files.length) return;
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 6699,
        thumb_url: await cloudinary.url(result.public_id, {
          width: 200,
          height: 200,
          crop: 'fill',
          format: 'jpg'
        })
      });
    }
    return uploadedUrls;
  } catch (error) {
    console.log('Error uploading image from local:', error);
    throw error;
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3
};
