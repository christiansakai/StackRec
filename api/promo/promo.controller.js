'use strict';

var _ = require('lodash');
var Promo = require('./promo.model');

// Get list of promos
exports.index = function(req, res) {
  Promo.find(function (err, promos) {
    if(err) { return handleError(res, err); }
    return res.json(200, promos);
  });
};

// Get a single promo
exports.show = function(req, res) {
  console.log("ISJDJFIDJFIJDIF store id?", req.params.id)
  var storeId = req.params.id;
  Promo.find({store: storeId}, function(err, promos){
    if(err) return handleError(res, err);
    if(!promos) return res.send(404);
    console.log('promos!?!?!?!?..', promos)
    return res.json(promos);
  })
};

// Creates a new promo in the DB.
exports.create = function(req, res) {
  var promo = new Promo();
  console.log('req', req.body)
  promo.description = req.body.description;
  promo.code = req.body.code;
  promo.expiry = req.body.expiry;
  promo.discount = req.body.discount;
  promo.store = req.body.store;

  promo.save(function(err, newPromo){
    if(err) res.json(404);
    res.json(200, newPromo);
  })
};

// Updates an existing promo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Promo.findById(req.params.id, function (err, promo) {
    if (err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    var updated = _.merge(promo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, promo);
    });
  });
};

// Deletes a promo from the DB.
exports.destroy = function(req, res) {
  Promo.findById(req.params.id, function (err, promo) {
    if(err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    promo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
