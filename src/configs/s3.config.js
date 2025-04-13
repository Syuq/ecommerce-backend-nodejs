'use strict';

const { S3Client, PutObjectCommand } = require('aws-sdk/clients/s3');

const s3Config = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
};

const s3 = new S3Client(s3Config);
module.exports = {
  s3,
  PutObjectCommand
};
