'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
//service
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESHTOKEN: 'x-rtoken-id'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Check if keys are defined
    if (!publicKey || !privateKey) {
      console.error('Keys are undefined:', { publicKey, privateKey });
      throw new Error('Authentication keys are undefined');
    }

    // For hex string keys, we need to use HS256 algorithm
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'HS256',
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'HS256',
      expiresIn: '7 days'
    });

    // Verify using the same key for symmetric algorithms like HS256
    JWT.verify(accessToken, privateKey, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token creation error:', error);
    return error;
  }
};
/*  ----- authentication---------
    1- check userId có missing ???
    2- get accessToken
    3- verifyToken 
    4- check user in dbs ?
    5- check keyStore with this userId ?
    6 if OKall -> return next()
*/
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError('Not Found keystore');

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.UserId) throw new AuthFailureError('Invalid UserId');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

/**
 * Authentication middleware for handling both access and refresh token validation
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {AuthFailureError} If userId is missing, token is invalid, or UserId mismatch
 * @throws {NotFoundError} If keystore is not found for the user
 */
const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  //2
  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError('Not Found keystore');

  //3
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId != decodeUser.UserId) throw new AuthFailureError('Invalid UserId');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken; // transmit to middleware

      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.UserId) throw new AuthFailureError('Invalid UserId');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2
};
