function HttpError(message, statusCode = 500) {
	this.name = 'HttpError';
	this.message = message;
	this.statusCode = statusCode;
	this.stack = (new Error()).stack;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;