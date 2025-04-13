'use strict';

const { NOTI } = require('../models/notification.model');

const pushNotiToSystem = async ({ type = 'SHOP-001', receivedId = 1, senderId = 1, options = {} }) => {
  let noti_content;
  switch (type) {
    case 'ORDER-001':
      noti_content = `@@@ Order successfully @@@`;
      break;
    case 'ORDER-002':
      noti_content = `@@@ Order failed @@@`;
      break;
    case 'PROMOTION-001':
      noti_content = `@@@ New promotion @@@`;
      break;
    case 'SHOP-001':
      noti_content = `@@@ New product by User following @@@`;
      break;
    default:
      noti_content = `@@@ Notification content @@@`;
  }
  const newNoti = await NOTI.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receiverId: receivedId,
    noti_content,
    noti_options: options
  });

  return newNoti;
};

module.exports = {
  pushNotiToSystem
};
