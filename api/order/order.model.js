'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statuses = 'Created Processing Cancelled Complete'.split(' ');

var OrderSchema = new Schema({
    name: {type: String },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyerOrder : {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    products: [],
    status: { type: String },
    createdTime: { type: Date, default: Date.now },
    storeOwner: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    chargeId: String
});

module.exports = mongoose.model('Order', OrderSchema);
