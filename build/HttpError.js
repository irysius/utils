'use strict';

function HttpError(message) {
	var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	this.name = 'HttpError';
	this.message = message;
	this.statusCode = statusCode;
	this.stack = new Error().stack;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;
