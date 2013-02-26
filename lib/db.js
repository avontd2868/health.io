var mwire = require('node-mwire');

function DB() {
	this._db = new mwire.Client({ host: '10.0.0.18', port: 6330, poolSize: 4 });
}

/*
* gets a value at id with a specific path
* @id {string}: the name of the Global 
* @path {array}: array containing strings which represent the path (subscripts) where the value is stored
*   if an emptry array is provided get value attached to the id (at the top level)
*/
DB.prototype.get = function(id, path, cb) {
	if (typeof path === 'function') {
		cb = path;
		path = [];
	}
	if (!id) return cb(new Error('missing Global name to get'));
	this._db.clientPool[this._db.connection()].getGlobal(id, path, function(err, resp) {
		if (!err) return cb(null, resp.value);
		else return cb(new Error('Failed to get ',id,' - ', err));
	});
}

/*
* sets a value at id with a specific path
* @id {string}: the name of the Global 
* @path {array}: array containing strings which represent the path (subscripts) where the value is to be stored
*   if an emptry array is provided store value at the top level attached to id
* @data {string}: currently only support string values
*/
DB.prototype.set = function(id, path, data, cb) {
	if (typeof data === 'function') {
		cb = data;
		data = '';
	}
	if (!id) return cb(new Error('missing Global name to set'));
	if (!path) return cb(new Error('missing Path (subscripts) to set'));
	if (!data || data === '') return cb(new Error('no data to save'));

	if (typeof data === 'string') {
		this._db.clientPool[this._db.connection()].setGlobal(id, path, data, function(err, resp) {
			if (err || !resp.ok) return cb(new Error('Failed to save ',id,' - ', err));
			else return cb (null, true);
		});
	}
}

/*
* delete a value at id from a specific path
* @id {string}: the name of the Global 
* @path {array}: array containing strings which represent the path (subscripts) where the value is to be deleted
*   if an emptry array is provided delete value at the top level attached to id
*/
DB.prototype.del = function(id, path, cb) {
	if (typeof path === 'function') {
		cb = path;
		path = [];
	}
	if (!id) return cb(new Error('missing Global name to delete'));
	this._db.clientPool[this._db.connection()].kill(id, path, function(err, resp) {
		if (err) return cb(new Error('Failed to delete ',id,' - ', err));
		else return (null, true);  //mwire returns 'ok' whether the element was actually deleted or not
	});
}

module.exports = exports = new DB();