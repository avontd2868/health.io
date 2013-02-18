var restify = request('restify'),
    server = restify.createServer(),
	io = request('socket.io').listen(server);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

server.get('/', function(req, res, next) {

});

io.sockets.on('connection', function(socket) {

});

server.listen(80, function() {
	connsole.log('Server started on port ', server.port());
})