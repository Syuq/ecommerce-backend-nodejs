'use strict';
// Only work with services and models so write static for speed
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequest, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { verify } = require('crypto');
const { keys } = require('lodash');
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
};
class AccessService {
  /*
        check this token used?
    */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // decode check see who is in the system
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log({ userId, email });
      await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happen !! plz reLogin');
    }
    const holdToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holdToken) throw new AuthFailureError('Shop is not register');

    // verify token
    const { userId, email } = await verifyJWT(refreshToken, holdToken.privateKey);
    console.log('[2]--', { userId, email });
    //check userid
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop is not register');

    const token = await createTokenPair({ UserId: foundShop._id, email }, holdToken.publicKey, holdToken.privateKey);
    await holdToken.updateOne({
      $set: {
        refreshToken: token.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // has been used to get new tokens
      }
    });
    return {
      user: { userId, email },
      token
    };
  };
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happen !! Pls reLogin');
    }
    if (keyStore.refreshToken != refreshToken) {
      throw new AuthFailureError('Shop is not register ');
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop is not register 2');
    // create 1 new token pair
    // const tokens = await createTokenPair({ userId: foundShop._id, email }, keyStore.publicKey, keyStore.privateKey);
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
    // update token
    await keyStore.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // has been used to get new tokens
      }
    });
    return {
      user,
      tokens
    };
  };

  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };
  // - check mail in dbs
  // - match password
  // - create AT vs RT and save   access token vs refresh token
  // - generate token
  // - get Data return login
  static login = async ({ email, password, refreshToken = null }) => {
    // check email
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequest('Error : shop not registered');
    // match password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication error ');
    // create token
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const token = await createTokenPair({ UserId: foundShop._id, email }, publicKey, privateKey);
    await keyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: token.refreshToken,
      privateKey,
      publicKey
    });
    return {
      shop: getInfoData({ filed: ['_id', 'name', 'email'], object: foundShop }),
      token
    };
  };
  static signUp = async ({ name, email, password }) => {
    // Check email exists?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequest('Error: Shop already register');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      role: [RoleShop.SHOP]
    });

    if (newShop) {
      // Generate private and public keys - using simple hex strings
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      console.log('Generated keys:', {
        privateKeyPreview: privateKey.substring(0, 20),
        publicKeyPreview: publicKey.substring(0, 20)
      });

      // Create token pair first
      const token = await createTokenPair({ UserId: newShop._id, email }, publicKey, privateKey);

      if (!token || token instanceof Error) {
        console.error('Token creation failed:', token);
        throw new Error('Failed to create authentication tokens');
      }

      // Then save keys and refresh token to database
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: token.refreshToken
      });

      console.log('KeyStore creation result:', keyStore ? 'Success' : 'Failed');

      if (!keyStore) {
        throw new Error('KeyStore error');
      }

      return {
        code: 201,
        metaData: {
          shop: getInfoData({ filed: ['_id', 'name', 'email'], object: newShop }),
          token
        }
      };
    }
  };
}

module.exports = AccessService;
