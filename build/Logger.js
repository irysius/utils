'use strict';

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

var bluebirdRegex = /node_modules[\\/]bluebird/g;
function stackFilter(stack) {
	var lines = stack.split('\n');
	return lines.filter(function (l) {
		return !bluebirdRegex.exec(l);
	}).join('\n');
}

module.exports = {
	silent: silentLogger,
	console: consoleLogger,
	isLoggerValid: isLoggerValid,
	stackFilter: stackFilter
};
