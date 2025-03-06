'use strict';

const CheckoutService = require('../services/checkout.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'checkoutreview',
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res);
  };

  getOrdersByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'checkoutreview',
      metadata: await CheckoutService.getOrdersByUser(req.query)
    }).send(res);
  };
}

module.exports = new CheckoutController();
