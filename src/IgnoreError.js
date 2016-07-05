function IgnoreError() {
	this.name = 'IgnoreError';
	this.message = 'This error is used only as a flow control mechanism, and is intended to be ignored.';
	this.stack = (new Error()).stack;
}
IgnoreError.prototype = Object.create(Error.prototype);
IgnoreError.prototype.constructor = IgnoreError;

module.exports = IgnoreError;