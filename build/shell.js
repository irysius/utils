'use strict';

var child_process = require('child_process');
var PATH = require('path');
var fs = require('fs');

function Shell(cwd) {
	var _cwd = PATH.resolve(cwd);
	try {
		fs.readdirSync(_cwd);
	} catch (e) {
		throw new Error('Shell attempted to load from an invalid directory: ' + _cwd);
	}

	function spawn(cmd) {
		var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		return new Promise(function (resolve, reject) {
			var process = child_process.spawn(cmd, args, { cwd: _cwd });
			var stdout = [],
			    stderr = [];
			process.stdout.on('data', function (data) {
				data.toString().split(/\r?\n/g).forEach(function (l) {
					stdout.push(l);
				});
			});
			process.stderr.on('data', function (data) {
				data.toString().split(/\r?\n/g).forEach(function (l) {
					stderr.push(l);
				});
			});
			process.on('close', function (code) {
				resolve({
					code: code,
					stdout: stdout,
					stderr: stderr
				});
			});
			process.on('error', function (error) {
				reject(error);
			});
		});
	}

	var instance = { spawn: spawn };
	Object.defineProperty(instance, 'cwd', {
		get: function get() {
			return _cwd;
		}
	});

	return instance;
}

module.exports = Shell;
