'use strict';

var _ = require('lodash');
var PATH = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mv = require('mv');
var mkdirp = require('mkdirp');
var ncp = require('ncp');

function stat(path) {
	return new Promise(function (resolve, reject) {
		fs.stat(path, function (err, stat) {
			if (err) {
				resolve(null);
			} else {
				resolve(stat);
			}
		});
	});
}
function writeFile(file, data) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { encoding: 'utf8' };

	return new Promise(function (resolve, reject) {
		fs.writeFile(file, data, options, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function readFile(file) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

	return new Promise(function (resolve, reject) {
		fs.readFile(file, options, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
function removeFile(file) {
	return new Promise(function (resolve, reject) {
		fs.unlink(file, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function moveFile(source, target) {
	return new Promise(function (resolve, reject) {
		mv(source, target, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function copyFile(source, target) {
	return new Promise(function (resolve, reject) {
		ncp(source, target, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function chmod(file, mode) {
	return new Promise(function (resolve, reject) {
		fs.chmod(file, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function removeFolder(path) {
	return new Promise(function (resolve, reject) {
		rimraf(path, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function assertFolder(path) {
	return new Promise(function (resolve, reject) {
		mkdirp(path, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function moveFolder(source, target) {
	return new Promise(function (resolve, reject) {
		mv(source, target, { mkdirp: true }, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function copyFolder(source, target) {
	return new Promise(function (resolve, reject) {
		ncp(source, target, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function listContents(path) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    filter = _ref.filter;

	if (!_.isFunction(filter)) {
		filter = function filter() {
			return true;
		};
	}
	return new Promise(function (resolve, reject) {
		fs.readdir(path, function (err, items) {
			if (err) {
				reject(err);
			} else {
				resolve(items);
			}
		});
	}).then(function (items) {
		var ps = items.map(function (item) {
			var fullpath = PATH.resolve(path, item);
			return stat(fullpath).then(function (stat) {
				return { path: fullpath, stat: stat };
			});
		});
		return Promise.all(ps).then(function (records) {
			return records.filter(filter);
		});
	});
}
function listFiles(path) {
	var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref2$recurse = _ref2.recurse,
	    recurse = _ref2$recurse === undefined ? false : _ref2$recurse,
	    ignore = _ref2.ignore;

	ignore = _.isArray(ignore) ? ignore : [ignore];
	return listContents(path).then(function (records) {
		var files = records.filter(function (record) {
			return record.stat.isFile();
		});
		var directories = records.filter(function (record) {
			return record.stat.isDirectory();
		});
		if (recurse && directories.length > 0) {
			var ps = directories.map(function (directory) {
				return directory.path;
			}).filter(function (path) {
				return ignore.indexOf(PATH.basename(path)) === -1;
			}).map(function (path) {
				return listFiles(path, { recurse: true, ignore: ignore });
			});
			return Promise.all(ps).then(function (subfiles) {
				return subfiles.reduce(function (prev, curr) {
					return prev.concat(curr);
				}, files);
			});
		} else {
			return files;
		}
	});
}
function listDirectories(path) {
	var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref3$recurse = _ref3.recurse,
	    recurse = _ref3$recurse === undefined ? false : _ref3$recurse,
	    ignore = _ref3.ignore;

	ignore = _.isArray(ignore) ? ignore : [ignore];
	var filter = function filter(value) {
		return value.stat.isDirectory();
	};
	return listContents(path, { filter: filter }).then(function (directories) {
		if (recurse && directories.length > 0) {
			var ps = directories.map(function (directory) {
				return directory.path;
			}).filter(function (path) {
				return ignore.indexOf(PATH.basename(path)) === -1;
			}).map(function (path) {
				return listDirectories(path, { recurse: true, ignore: ignore });
			});
			return Promise.all(ps).then(function (subdirectories) {
				return subdirectories.reduce(function (prev, curr) {
					return prev.concat(curr);
				}, directories);
			});
		} else {
			return directories.filter(function (directory) {
				return ignore.indexOf(PATH.basename(directory.path)) === -1;
			});
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
