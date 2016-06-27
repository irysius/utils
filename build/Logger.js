"use strict";
var _ = require('lodash');

function noop() {}
function silentLogger() {
	return {
		info: noop, warn: noop, error: noop, log: noop
	};
}
function consoleLogger() {
	return console;
}
function isLoggerValid(logger) {
	return _.isFunction(logger.info) && _.isFunction(logger.warn) && _.isFunction(logger.error) && _.isFunction(logger.log);
}

module.exports = {
	silent: silentLogger,
	console: consoleLogger,
	isLoggerValid: isLoggerValid
};
