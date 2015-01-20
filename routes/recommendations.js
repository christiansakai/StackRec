var express = require('express');
var router = express.Router();

var Order = require('../api/order/order.model')
var Product = require('../api/product/product.model')
var Tag = require('../api/tag/tag.model');
var Store = require('../api/store/store.model');

var _ = require('lodash');

var relevantProducts = [];
var quantityHash = {};

function formatHash(id, callback) {
    relevantProducts.forEach(function(array) {
    	console.log(quantityHash);
        array.reduce(function(prev, curr, index, array) {
            if (curr._id !== id) {
                if (!prev[curr._id]) {
                    prev[curr._id] = curr._id;
                    prev[curr._id].quantity = 1;
                } else {
                    prev[curr._id].quantity += 1;
                }
                return prev;
            }
        }, quantityHash);
    });
    callback()
}

/* GET users listing. */
router.get('/:id', function(req, res) {
		if(!req.params.id) return res.send(405)
    relevantProducts = [];
    quantityHash = {};

    var id = req.params.id;
    var tag = req.query.tag ? req.query.tag : null;

    Order.find(function(err, orders) {
        orders.forEach(function(order) {
            var flag = false;
            order.products.forEach(function(product){
            	if(product._id === id){
            		flag = true;
            	}
            })
            if(flag === true){
            	relevantProducts.push(order.products);
            }
        })
        formatHash(id,function(){
        	res.json(quantityHash);
        });
    })
});

module.exports = router;
