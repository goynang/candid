var CardProvider = require('../providers/card_provider').CardProvider;
var cardProvider = new CardProvider('localhost', 27017);  

exports.list = function(req, res){
  cardProvider.findAll(function(error, docs) {
    res.json(docs);
  });
}

exports.create = function(req, res){
  cardProvider.save({
    summary: req.param('summary'),
    list: 0,
    cost: 0,
    value: 0
  }, function(error, docs) {
    // what?
  });
}