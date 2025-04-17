'use strict';

const { findById } = require('../services/apikey.service');
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
};

/*
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    console.log(key, 'key');
    if (!key) {
      return res.status(403).json({
        message: 'forbidden error'
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'forbidden error objKey'
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error('❌ API Key Middleware Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
*/
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    console.log(key, 'key');
    if (!key) {
      return res.status(403).json({
        message: 'forbidden error'
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'forbidden error objKey'
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'forbidden error permissions'
      });
    }
    console.log(`permissions::`, req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied'
      });
    }
    return next();
  };
};

module.exports = { apiKey, permission };
