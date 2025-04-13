'use strict';

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Comments';
const COLLECTION_NAME = 'Comments';

/**
 * Mongoose schema definition for Comments, representing user comments on products
 * with nested comment support and tracking metadata.
 *
 * @schema commentSchema
 * @property {ObjectId} comment_productId - Reference to the associated product
 * @property {Number} comment_userId - User ID of the comment author
 * @property {String} comment_content - Text content of the comment
 * @property {Number} comment_left - Left boundary for nested comment tracking
 * @property {Number} comment_right - Right boundary for nested comment tracking
 * @property {ObjectId} comment_parentId - Reference to parent comment for nested comments
 * @property {Boolean} isDeleted - Soft delete flag for the comment
 */
const commentSchema = new Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Products' },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
