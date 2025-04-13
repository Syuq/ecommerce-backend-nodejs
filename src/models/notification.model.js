'use strict';

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';
/**
 * Mongoose schema for Notification documents, defining the structure and validation rules
 * for different types of system notifications.
 *
 * @schema notificationSchema
 * @property {String} noti_type - Notification type with predefined enum values
 * @property {Number} noti_senderId - Unique identifier of the notification sender
 * @property {Number} noti_receiverId - Unique identifier of the notification recipient
 * @property {String} noti_content - Textual content of the notification
 * @property {Object} noti_options - Optional additional metadata for the notification
 */
// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by User following

const notificationSchema = new Schema(
  {
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
    noti_senderId: { type: Number, required: true },
    noti_receiverId: { type: String, required: true },
    noti_content: { type: String, default: 'text', required: true },
    noti_options: { type: Object, default: {} }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports = {
  NOTI: model(DOCUMENT_NAME, notificationSchema)
};
