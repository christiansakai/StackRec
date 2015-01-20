'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Product = require('../product/product.model');

var StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    info: String,
    active: Boolean,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

StoreSchema.statics.getProducts = function(name, cb) {
    
    this.findOne({
        name: name
    }, function(err, store) {
            // console.log('its finding the store--> ', store._id);
        if (err) console.log('Error is', err);
           if(!store) { console.log('Store is null') }

              Product.find({storeId: store._id},cb)

        // mongoose.model('Product').find({storeId: store._id}, cb);

    })

}

module.exports = mongoose.model('Store', StoreSchema);