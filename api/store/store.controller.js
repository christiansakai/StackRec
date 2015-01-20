'use strict';

var _ = require('lodash');
var async = require('async');
var Store = require('./store.model');
var Product = require('../product/product.model');
var User = require('../user/user.model');

// Get list of products from a given store
exports.getproducts = function(req, res) {

    Store.getProducts(req.params.name, function(err, products) {
      if(err) { console.log(err) }
         if(!products) { console.log('No store found!') }

      return res.json(200, products);
    });
};

// Get list of stores
exports.index = function(req, res) {
    Store.find(function(err, stores) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, stores);
    });
};

// Get a single store
exports.show = function(req, res) {

    Store.findOne({
            name: req.params.name
        })
        .populate('products')
        .exec(function(err, store) {
            if (err) {
                console.log('error')
                return handleError(res, err);
            }
            if (!store) {
                console.log('no store')
                return res.send(404);
            }
            return res.json(store);
        })
};

// Creates a new store in the DB.
exports.create = function(req, res) {
 
    var store = new Store({
        owner: req.user._id,
        name: req.body.name,
        products: []
    });

    store.save(function(err, store) {
        if (err) {
            return handleError(res, err);
        }
        User.findById(req.user._id, function(err, user) {
            if (err) {
                return handleError(res, err);
            }

        
            user.stores.push(store._id)
            user.save(function(err, user) {
                return res.json(store);
            })
        });
    });

};

// Updates an existing store in the DB.
exports.update = function(req, res) {
    if (!req.owner) return res.send(404);
    if (req.body._id) {
        delete req.body._id;
    }
    Store.findById(req.params.id, function(err, store) {
        if (err) {
            return handleError(res, err);
        }
        if (!store) {
            return res.send(404);
        }
        var updated = _.merge(store, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, store);
        });
    });
};

// Deletes a store from the DB.
exports.destroy = function(req, res) {
    if (!req.owner) return res.send(404);
    Store.findById(req.params.id, function(err, store) {
        if (err) {
            return handleError(res, err);
        }
        if (!store) {
            return res.send(404);
        }
        store.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

exports.checkOwner = function(req, res) {
    if (req.owner) return res.send(200);
    else {
        return res.send(201);
    }
}

exports.search = function(req,res){
  var storeName = req.params.name;
  var searchText = req.body.searchtext;

  Store.findOne({name:storeName},function(err,store){
    var storeId = store._id;
    Product.find({$text: {$search:searchText}},{score: {$meta:"textScore"}})
           .sort({score: {$meta: 'textScore'}})
           .where({owner:storeId})
           .exec(function(err,results){
             if (err) return console.err(err);
             if (!results) return res.send(440);
             var sendObj = {};
             sendObj.data = results;
             res.json(sendObj);
           })
  });
}

function handleError(res, err) {
    return res.send(500, err);
}
