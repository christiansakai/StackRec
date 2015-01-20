'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  title:{type: String, required: true},
  body: {type: String, required: true},
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  upvotes: Number,
  stars: {type:Number, min: 0, max: 5}
  });

module.exports = mongoose.model('Comment', CommentSchema);
