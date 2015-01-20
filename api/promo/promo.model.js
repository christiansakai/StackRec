'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PromoSchema = new Schema({
    description: { type: String, required: true },
    expiry: {type: Date, required: true},
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    code: {type: String, unique: true, required: true},
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    discount: { type: Number, required: true }
});

module.exports = mongoose.model('Promo', PromoSchema);
