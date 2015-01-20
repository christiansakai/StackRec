/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var async = require('async');
var Thing = require('../api/thing/thing.model');
var Product = require('../api/product/product.model')
var User = require('../api/user/user.model');
var Order = require('../api/order/order.model')

var Promo = require('../api/promo/promo.model')
var Store = require('../api/store/store.model')
var Tag = require('../api/tag/tag.model')
var Comment = require('../api/comment/comment.model');



async.waterfall([
    function(callback){
      User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'lindsay',
        email: 'test@test.com',
        password: 'test',
        role: 'user',
        contact: {
          phone: 2011231234,
          address: '91 Wall Street'
        }
      }, {
        provider: 'local',
        role: 'admin',
        name: 'sam',
        email: 'admin@admin.com',
        password: 'admin',
        contact: {
          phone: 1938675309,
          address: '5 Hanover Square'
        }
      }, function(err,users) {
          callback();
        }
      );
    });
    },
    function(callback){
      User.find({},function(err,users){
        var idOne = users[0]._id;
        var idTwo = users[1]._id;
          Store.find({}).remove(function(){
            Store.create({
              name: "StoreOne",
              info: 'b',
              active: true,
              owner: idOne
            }, {
              name: "StoreTwo",
              info: 'a',
              active: true,
              owner: idTwo
            }, function(err,stores){
              if (err) console.error(err);
              callback();
            }
          );
      });
    });
  },
  function(callback){
    User.find({},function(err,users){
      Store.find({},function(err,stores){
        Product.find({}).remove(function(){
          callback(null,users,stores);
        })
      })
    })
  },
  function(users,stores,callback){
    var lindsayStoreId = stores.filter(function(obj){
      if (obj.name==="storeone"){return obj._id;}
      })[0];
    var lindsayUserId = users.filter(function(obj){
      if (obj.name==="lindsay"){return obj._id;}
      })[0];
    var samsUserId = users.filter(function(obj){
      if (obj.name==="sam"){return obj._id;}
      })[0];
    var samsStoreId = stores.filter(function(obj){
      if (obj.name==="storetwo"){return obj._id;}
    })[0];

    var idObject = {
      'lindsayStoreId': lindsayStoreId,
      'samsStoreId': samsStoreId,
      'lindsayUserId': lindsayUserId,
      'samsUserId': samsUserId
    }

    Product.create({
      name: 'lindsay\'s Product',
      info: 'tp is life',
      active: true,
      upvotes: 1200,
      owner: lindsayUserId,
      price: 19.99,
      description: 'tp is love',
      inventory: {
        available: 12,
        maximum: 42
      }
    },{
      name: 'sam\'s Product',
      info: 'wat is info',
      active: true,
      upvotes: 1010,
      owner: samsUserId,
      price: 23.36,
      description: 'sams description',
      inventory: {
        available: 101,
        maximum: 20123
      }
    },function(){
      callback(null,idObject);
    })
  },
  function(idObject,callback){
    Product.find({},function(err,products){

      console.log('WEEEEEEEEEE',products)
      var lindsayProductId = products.filter(function(obj){
        if (obj.name==='lindsay\'s Product') {return obj._id;}
        })[0];
      var samProductId = products.filter(function(obj){
        if (obj.name==='sam\'s Product') {return obj._id;}
        })[0];
        idObject.lindsayProductId = lindsayProductId;
        idObject.samProductId = samProductId;
        callback(null,idObject);
    })
  },
  //   function(idObject,callback){
  //   Store.findOne({name:'StoreOne'},function(err,store){
  //     console.log("store",store);
  //     store.products = [idObject.lindsayProductId];
  //     store.save();
  //     Store.findOne({name:'StoreTwo'},function(err,store){
  //       store.products=[idObject.samProductId];
  //       store.save();
  //       callback(null,idObject);
  //     })
  //   })
  // },
  function(idObject,callback){
    Comment.find({}).remove(function(){
      Comment.create({
        title: 'Worst Product Ever',
        body: 'this is so bad blah blah blah. FIELRSASDFASDF ',
        owner: idObject.lindsayUserId,
        product: idObject.samProductId,
        upvotes: 101,
        stars: 0,
        active: true
      },{
        title: 'Best Product Ever',
        body: 'this product is great',
        owner: idObject.samsUserId,
        product: idObject.lindsayProductId,
        upvotes: 55,
        stars: 4,
        active: true
      },function(){
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Comment.findOne({upvotes: 101},function(err,comment){
      idObject.lindsayReviewId = comment._id;
      Comment.findOne({upvotes: 55},function(err,comment){
        idObject.samReviewId = comment._id;
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Product.findOne({upvotes: 1200},function(err,product){
      product.comments = [idObject.lindsayReviewId];
      product.save();
      Product.findOne({upvotes:1010},function(err,product){
        product.comments = [idObject.samReviewId];
        product.save();
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    User.findOne({name:'lindsay'},function(err,user){
      user.comments = [idObject.lindsayReviewId];
      user.save();
      User.findOne({name:'sam'},function(err,user){
        user.comments = [idObject.samReviewId];
        user.save()
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Product.find({},function(err,products){
      var lindsayProductId = products.filter(function(obj){
        if (obj.name==='lindsay\'s Product') {return obj._id;}
      })[0];
      var samProductId = products.filter(function(obj){
        if (obj.name==='sam\'s Product') {return obj._id;}
      })[0];
      idObject.lindsayProductId = lindsayProductId;
      idObject.samProductId = samProductId;
      idObject.actualLindsayProduct = products[0];
      idObject.actualSamProduct = products[1];
      Tag.find({}).remove(function(){
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Tag.create({
      name: 'awesome',
      info: 'what is this field for',
      active: true,
      products: [idObject.samProductId]
    },{
      name: 'tpLove',
      info: 'tpLife',
      active: true,
      products: [idObject.lindsayProductId]
    },function(){
      callback(null,idObject)
    })
  },
  function(idObject,callback){
    Tag.find({},function(err,tags){
      var lindsayTagId = tags.filter(function(obj){
        if (obj.name==='tpLove') {return obj._id;}
      })[0];
      var samTagId = tags.filter(function(obj){
        if (obj.name==='awesome') {return obj._id;}
      })[0];
      idObject.lindsayTagId = lindsayTagId;
      idObject.samTagId = samTagId;
      callback(null,idObject);
    })
  },
  function(idObject,callback){
    Promo.find({}).remove(function(){
      Promo.create({
        description: 'lindsayPromo',
        expiry: Date.now,
        code: 'TPTPTP',
        store: idObject.lindsayStoreId,
        discount: 10
      },{
        description: 'samPromo',
        expiry: Date.now,
        code: 'coffee',
        store: idObject.samsStoreId,
        discount: 10
      },function(){
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Order.find({}).remove(function(){
      Order.create({
        name: 'is this a UUID?',
        buyer: idObject.lindsayUserId,
        products: [idObject.actualLindsayProduct],
        status: 'Created',
        storeOwner: [idObject.samsUserId]
      },{
        name: 'necessary field?',
        buyer: idObject.samsUserId,
        products: [idObject.actualSamProduct],
        status: 'Processing',
        storeOwner: [idObject.lindsayUserId]
      },function(){
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Order.find({},function(err,orders){
      var lindsayOrderId = orders.filter(function(obj){
        if (obj.name==='is this a UUID?') {return obj._id;}
        })[0];
      console.log('orders', orders)
      var samOrderId = orders.filter(function(obj){
        if (obj.name==='necessary field?') {return obj._id;}
        })[0];
      idObject.lindsayOrderId = lindsayOrderId;
      idObject.samOrderId = samOrderId;
      callback(null,idObject);
    });
  },
  function(idObject,callback){
    User.findOne({name: 'lindsay'},function(err,user){
      user.stores = [idObject.lindsayStoreId];
      user.orders = [idObject.lindsayOrderId._id];
      user.favorites = [idObject.lindsayProductId,idObject.samProductId];
      user.save();
      User.findOne({name:'sam'},function(err,user){
        user.stores = [idObject.samsStoreId];
        user.orders = [idObject.samOrderId];
        user.favorites = [idObject.lindsayProductId,idObject.samProductId];
        user.save()
        callback(null,idObject);
      })
    })
  },
  function(idObject,callback){
    Product.findOne({name: 'lindsay\'s Product'},function(err,product){
      product.tags = [idObject.lindsayTagId];
      product.save();
      Product.findOne({name: 'sam\'s Product'},function(err,product){
        product.tags = [idObject.samTagId];
        product.save();
        callback();
      })
    })
  },
  function(callback){
    Comment.find({},function(err,comments){
      // console.log("this is all the comments",comments);
    })
    // User.find({},function(err,users){
    //   console.log('users',users);
    //   Store.find({},function(err,stores){
    //     console.log('stores',stores);
    //     Product.find({},function(err,products){
    //       console.log('products',products);
    //       Tag.find({},function(err,tags){
    //         console.log('tag',tags);
    //         Promo.find({},function(err,promos){
    //           console.log('promos',promos);
    //           Order.find({},function(err,orders){
    //             console.log('orders',orders);
    //             callback();
    //           })
    //         })
    //       })
    //     })
    //   })
    // })
  }
]);
