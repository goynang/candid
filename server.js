// Dependencies
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    path    = require('path');
    
// Controllers
var appController = require('./app/controllers/app_controller');
var cardController = require('./app/controllers/card_controller');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'hjs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}                      

// Routes
app.get('/', appController.index);
app.get('/cards', cardController.list);
app.post('/cards', cardController.create);

// Sockets
io.sockets.on('connection', function (socket) {
  socket.emit('welcome', 'hello');
  socket.on('log', function (data) {
    console.log(data);
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
