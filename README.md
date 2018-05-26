#Utilities

Relies on a global implementation of Promise.

The set of utilities here are intended to be reused across my modules.

They mostly revolve around Promisifying and grouping existing node functions to my liking.

## Installation

	$ npm install @irysius/utils
	
## API

### fs

**fs.stat**

`fs.stat(path: String) => ???`

**fs.writeFile**

`fs.writeFile(file: String, data: String, options) => Promise`

Promise returning version of node's `fs.writeFile`.

**fs.readFile**

`fs.readFile(file: String, options) => Promise<any>`

Promise returning version of node's `fs.readFile`.

**fs.removeFile**

`fs.removeFile(file: String) => Promise`

Promise returning version of node's `fs.unlink`.

**fs.moveFile**

`fs.moveFile(source: String, target: String) => Promise`

Wraps the `mv` library in a Promise.

**fs.copyFile**

`fs.copyFile(source: String, target: String)` => Promise`

Wraps the `ncp` library in a Promise.

**fs.chmod**

`fs.chmod(file: String, mode: Number) => Promise`

Promise returning version of node's `fs.chmod`.

**fs.removeFolder**

`fs.removeFolder(path: String) => Promise`

Wraps the `rimraf` library in a Promise.

**fs.assertFolder**

`fs.assertFolder(path: String) => Promise`

Wraps the `mkdirp` library in a Promise.

**fs.moveFolder**

`fs.moveFolder(source: String, target: String) => Promise`

Wraps the `mv` library in a Promise.

**fs.copyFolder**

`fs.copyFolder(source: String, target: String) => Promise`

Wraps the `ncp` library in a Promise.

**fs.listContents**

`fs.listContents(path: String, options) => Promise<Array<{ path: String, stat: fs.Stats }>>`

Returns an array of item records at the provided path (shallow). An item record exposes its full path, and the corresponding stats object.

options.filter takes a predicate that takes an item record, and will only return items for which the predicate returns true for. 

**fs.listFiles**

`fs.listFiles(path: String, options) => Promise<Array<String>>`

Returns an array of full file paths at the provided path.

options.recurse is a boolean that determines if listing the files should be recursive or not.

options.ignore is a string or array of strings to exclude from the results based on an indexOf check against the file's basename.

**fs.listDirectories**

`fs.listDirectories(path: String, options) => Promise<Array<String>>`

Returns an array of full directory paths at the provided path.

options.recurse is a boolean that determines if listing the directories should be recursive or not.

options.ignore is a string or array of strings to exclude from the results based on an indexOf check against the folder's basename.