/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Promo = require('./promo.model');

exports.register = function(socket) {
  Promo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Promo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('promo:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('promo:remove', doc);
}