var _ = require('lodash');
var PATH = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mv = require('mv');
var mkdirp = require('mkdirp');
var ncp = require('ncp');

function stat(path) {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stat) => {
			if (err) { resolve(null); }
			else { resolve(stat); }	
		});	
	});
}
function writeFile(file, data, options = { encoding: 'utf8' }) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, options, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});	
	});
}
function readFile(file, options = 'utf8') {
	return new Promise((resolve, reject) => {
		fs.readFile(file, options, (err, data) => {
			if (err) { reject(err); }
			else { resolve(data); }
		});
	});
}
function removeFile(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function moveFile(source, target) {
	return new Promise((resolve, reject) => {
		mv(source, target, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});	
	});
}
function copyFile(source, target) {
	return new Promise((resolve, reject) => {
		ncp(source, target, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function chmod(file, mode) {
	return new Promise((resolve, reject) => {
		fs.chmod(file, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function removeFolder(path) {
	return new Promise((resolve, reject) => {
		rimraf(path, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function assertFolder(path) {
	return new Promise((resolve, reject) => {
		mkdirp(path, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function moveFolder(source, target) {
	return new Promise((resolve, reject) => {
		mv(source, target, { mkdirp: true }, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});	
	});
}
function copyFolder(source, target) {
	return new Promise((resolve, reject) => {
		ncp(source, target, err => {
			if (err) { reject(err); }
			else { resolve(); }
		});
	});
}
function listContents(path, { filter } = {}) {
	if (!_.isFunction(filter)) {
		filter = () => true;
	}
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, items) => {
			if (err) { reject(err); }
			else { resolve(items); }
		});
	}).then(items => {
		var ps = items.map(item => {
			let fullpath = PATH.resolve(path, item);
			return stat(fullpath).then(stat => {
				return { path: fullpath, stat: stat };
			});
		});
		return Promise.all(ps).then(records => {
			return records.filter(filter);
		});
	});
}
function listFiles(path, { recurse = false, ignore } = {}) {
	ignore = _.isArray(ignore) ? ignore : [ignore];
	return listContents(path).then(records => {
		let files = records
			.filter(record => record.stat.isFile());
		let directories = records
			.filter(record => record.stat.isDirectory());
		if (recurse && directories.length > 0) {
			let ps = directories
				.map(directory => directory.path)
				.filter(path => ignore.indexOf(PATH.basename(path)) === -1)
				.map(path => listFiles(path, { recurse: true, ignore: ignore }));
			return Promise.all(ps).then(subfiles => {
				return subfiles.reduce((prev, curr) => {
					return prev.concat(curr); 
				}, files);
			});
		} else {
			return files;
		}
	});
}
function listDirectories(path, { recurse = false, ignore } = {}) {
	ignore = _.isArray(ignore) ? ignore : [ignore];
	let filter = (value) => { return value.stat.isDirectory(); }
	return listContents(path, { filter: filter }).then(directories => { 
		if (recurse && directories.length > 0) {
			let ps = directories
				.map(directory => directory.path)
				.filter(path => ignore.indexOf(PATH.basename(path)) === -1)
				.map(path => listDirectories(path, { recurse: true, ignore: ignore }));
			return Promise.all(ps).then(subdirectories => {
				return subdirectories.reduce((prev, curr) => {
					return prev.concat(curr); 
				}, directories);
			});
		} else {
			return directories
				.filter(directory => ignore.indexOf(PATH.basename(directory.path)) === -1);
		}
	});
}

module.exports = {
	stat: stat,
	writeFile: writeFile,
	readFile: readFile,
	removeFile: removeFile,
	moveFile: moveFile,
	copyFile: copyFile,
	chmod: chmod,
	removeFolder: removeFolder,
	assertFolder: assertFolder,
	moveFolder: moveFolder,
	copyFolder: copyFolder,
	listContents: listContents,
	listFiles: listFiles,
	listDirectories: listDirectories		
};