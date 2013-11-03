var socket = io.connect('http://127.0.0.1:3000');

$(function() {
  
  var Card = Backbone.Model.extend({});
  
  var CardList = Backbone.Collection.extend({
    model: Card,
    url: 'cards'
  });

  var cardList = new CardList;
  
  var CardView = Backbone.View.extend({
    tagName:  "li",
    attributes: {class: 'card'},
    template: _.template($('#card-template').html()),
    
    render: function() {
      this.$el.attr('id', 'card-' + this.model.get('_id'));
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });

  var AppView = Backbone.View.extend({

    el: '#app',

    events: {
      "keypress .new-card-summary":  "createOnEnter"
    },
    
    initialize: function() {
      this.listenTo(cardList, 'add', this.addCard);
      this.listenTo(cardList, 'reset', this.addAllCards);
      this.listenTo(cardList, 'all', this.render);
      cardList.fetch();
    },
    
    addCard: function(card) {
      var view = new CardView({model: card});
      this.$(".wanted .cards li:last-child").before(view.render().el);
    },
    
    addAllCards: function() {
      cardList.each(this.addCard, this);
    },
    
    render: function(){
      return this;
    },
    
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      e.preventDefault();
      var input = this.$(".new-card-summary");
      if (!input.val()) return;
      cardList.create({summary: input.val(), cost: 0});
      input.val('');
    }
  });
  
  var appView = new AppView();
  
  
  
  
  
  $('.cards').sortable({
    connectWith: '.cards',
    items: '.card',
    update: App.moveCard
  }).disableSelection();
  
  $('.person').draggable({
    helper: 'clone'
  });
  
  $('.card').droppable({
    accept: '.person',
    drop: App.assignPerson
  });
  
  $( "#modal" ).dialog({
    autoOpen: false,
    modal: true,
    show: 'fade',
    hide: 'fade',
  });
  
  $('.board').on('click', '.card a', function(e){
    e.preventDefault();
    $( "#modal" ).dialog( "open" );
  });
  
  // $('.new-card-summary').keyup(function() {
  //   if (event.which == 13) {
  //     App.createCard(this.value);
  //   }
  // });
    
  // $('.board').sortable({
  //   handle: 'h2',
  //   containment: "document",
  //   update: function( event, its ) { socket.emit('log', $('.board').sortable( "toArray" )); }
  // }).disableSelection();
  
  // socket.on('welcome', function (data) {
  //   console.log(data);
  //   socket.emit('log', { decision: confirm('Agree?') });
  // });
});

var App = {
  
  speak : function (event, ui) {
    console.log('-----');
    console.log(event); 
    console.log(ui);
  },
  
  createCard : function(summary) {
    $('.new-card-form').submit();
  },
  
  assignPerson : function(event, ui) {
    console.log('Person ' + $(event.toElement).attr('data-ref') + ' dropped onto card ' + $(this).attr('data-ref'));
  },
  
  moveCard : function(event, ui) {
    console.log( 'List '  + $(this).parent().attr('data-ref') + ' order is now ' + $(this).sortable( "toArray", { attribute: 'data-ref'} ) );
    socket.emit('log', $('.cards').sortable( "toArray" ));
  },

  publish : function () {
    // socket.emit('log', $('#todo').sortable( "toArray" )); 
  }
}