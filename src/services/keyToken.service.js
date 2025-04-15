'use strict';

const keytokenModel = require('../models/keytoken.model');
const {
  Types: { ObjectId }
} = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken = null }) => {
    try {
      // Log incoming data for debugging
      console.log('Creating key token for user:', userId);
      console.log('Keys provided:', !!publicKey, !!privateKey);

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken: refreshToken || null
      };
      const options = { upsert: true, new: true };

      const token = await keytokenModel.findOneAndUpdate(filter, update, options);
      return token ? token.publicKey : null;
    } catch (error) {
      console.error('KeyToken creation error:', error);
      return error;
    }
  };

  static findByUserId = async ({ userId }) => {
    return await keytokenModel.findOne({ user: userId });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.remove(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.findByIdAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
