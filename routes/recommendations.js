var express = require('express');
var router = express.Router();

var Order = require('../api/order/order.model');
var Product = require('../api/product/product.model');
var Tag = require('../api/tag/tag.model');
var Store = require('../api/store/store.model');

var _ = require('lodash');

var relevantProducts = [];
var quantityHash = {};

function formatHashV2(id){
  var hashTable = {};
  relevantProducts.forEach(function(array){
    array.forEach(function(obj){
        if (hashTable[obj._id.toString()]){
          hashTable[obj._id.toString()]+=1;
        } else {
          hashTable[obj._id.toString()]=1;
        }
    });
  });
  if (hashTable[id]){
    delete hashTable[id];
  }
  return hashTable;
}

function formatHashV3(id){
  var hashTable = {};
  hashTable[id] = {};
  var orderLength=0;
  relevantProducts.forEach(function(order){
    order.forEach(function(product){
      if (product._id.toString()!==id.toString()){
        if (hashTable[id][product._id.toString()]){
          // console.log("adding");
          hashTable[id][product._id.toString()]+=1;
        } else {
          // console.log('ID:',product._id.toString());
          hashTable[id][product._id.toString()]=1;
        }
      }
    });
    orderLength++;
  });
  console.log(orderLength);
  return hashTable;
}

function top3Id(hashTable){
  var array = [];
  var lastIndex = 0;
  for (var keys in hashTable){
    array.push([keys,hashTable[keys]]);
  }
  array.sort(function(a,b){
    return a-b;
  });
  if (array.length<3){
    lastIndex=array.length-1;
  } else {
    lastIndex = 3;
  }
  return array.map(function(arr){
    return arr[0];
  }).slice(0,lastIndex);
}

function formatHash(id, callback) {
  // console.table("this is the relevantProducts",relevantProducts);
    relevantProducts.forEach(function(array) {
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
    // console.log("this is the quantityHash",quantityHash);
    callback();
}

/* GET users listing. */
router.get('/:id', function(req, res) { //Takes a product ID and reccomends 3 products based off of it
		if(!req.params.id) return res.send(405);
    relevantProducts = [];
    quantityHash = {};

    var id = req.params.id;
    var tag = req.query.tag ? req.query.tag : null;
    // console.log('tag',tag);

    Order.find(function(err, orders) {
        orders.forEach(function(order) {
            var flag = false;
            order.products.forEach(function(product){
            	if(product._id.toString() === id.toString()){
            		flag = true;
            	}
            });
            if(flag === true){
            	relevantProducts.push(order.products);
            }
        });
        // relevantProducts.forEach(function(obj){
        //   console.log(JSON.stringify(obj,null,2));
        // });
        var retHash = formatHashV2(id);
        var top3Arr = top3Id(retHash);
        res.json(top3Arr);
    });
});

module.exports = router;
