var child_process = require('child_process');
var PATH = require('path');
var fs = require('fs');

function Shell(cwd) {
	let _cwd = PATH.resolve(cwd);
	try {
		fs.readdirSync(_cwd);
	} catch (e) {
		throw new Error(`Shell attempted to load from an invalid directory: ${_cwd}`);
	}
	
	function spawn(cmd, args = []) {
		return new Promise((resolve, reject) => {
			let process = child_process.spawn(cmd, args, { cwd: _cwd });
			let stdout = [], stderr = [];
			process.stdout.on('data', data => {
				data.toString().split(/\r?\n/g).forEach(l => {
					stdout.push(l);	
				});
			});
			process.stderr.on('data', data => {
				data.toString().split(/\r?\n/g).forEach(l => {
					stderr.push(l);	
				});
			});
			process.on('close', code => {
				resolve({
					code: code,
					stdout: stdout,
					stderr: stderr
				});
			});
			process.on('error', error => {
				reject(error);
			});
		});
	}
	
	var instance = { spawn: spawn };
	Object.defineProperty(instance, 'cwd', {
		get: () => _cwd
	});
	
	return instance;
}

module.exports = Shell;