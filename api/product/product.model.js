'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type: String, required: true},
    active: Boolean,
    upvotes: Number,
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    price:{type: Number, required: true} ,
    description:{type: String},
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    inventory: {
        available: Number,
        maximum: Number
    },
    media: [String]
});

ProductSchema.index({name: 'text',info: 'text',description: 'text'});

module.exports = mongoose.model('Product', ProductSchema);
