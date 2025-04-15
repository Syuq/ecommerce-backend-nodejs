'use strict';

const AccessService = require('../services/access.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshTokenV2({
        keyStore: req.keyStore,
        refreshToken: req.refreshToken,
        user: req.user
      })
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  };
  signUp = async (req, res, next) => {
    // try {
    //   console.log(`[P]::signUp::`, req.body);
    //   /*
    //   200 Ok
    //   201 CREATED
    //   */
    //   return res.status(201).json(await AccessService.signUp(req.body));
    // } catch (error) {
    //   next(error);
    // }
    new CREATED({
      message: 'Register',
      metadata: await AccessService.signUp(req.body)
    }).send(res);
  };
}

module.exports = new AccessController();
