'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: {type: String, required: true,unique: true}
  });

module.exports = mongoose.model('Tag', TagSchema);
