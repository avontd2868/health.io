var restify = require('restify'),
    server = restify.createServer(),
	io = require('socket.io').listen(server),
	ecstatic = require('ecstatic');

var routes = require('./routes').routes;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

server.get('/:id', routes.v1.get);
server.get('/:id/:key', routes.v1.get);

server.post('/', routes.v1.set);
server.put('/', routes.v1.set);

server.del('/:id', routes.v1.del);
server.del('/:id/:key', routes.v1.del);

server.get(/\/?.*/, ecstatic({ root: __dirname + '/public' }));

io.sockets.on('connection', function(socket) {
	socket.emit('news', {hello: 'world'});
});

server.listen(80, function() {
	console.log('Server started ', new Date());
})