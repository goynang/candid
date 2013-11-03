var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

CardProvider = function(host, port) {
  this.db = new Db('candid-cards', new Server(host, port, {
    safe: true
  }, {
    auto_reconnect: true
  }, {}));
  this.db.open(function() {});
};

CardProvider.prototype.getCollection = function(callback) {
  this.db.collection('cards', function(error, card_collection) {
    if (error) callback(error);
    else callback(null, card_collection);
  });
};

CardProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, card_collection) {
    if (error) callback(error)
    else {
      card_collection.find().toArray(function(error, results) {
        if (error) callback(error)
        else callback(null, results)
      });
    }
  });
};

CardProvider.prototype.save = function(cards, callback) {
  this.getCollection(function(error, card_collection) {
    if (error) callback(error)
    else {
      if (typeof(cards.length) == "undefined") cards = [cards];

      for (var i = 0; i < cards.length; i++) {
        card = cards[i];
        card.created_at = new Date();
      }

      card_collection.insert(cards, function() {
        callback(null, cards);
      });
    }
  });
};

exports.CardProvider = CardProvider;
