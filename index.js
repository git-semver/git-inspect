const path = require('path');
const Inspector = require('./lib/inspector');
const Repository = require('./lib/adapters/nodegit/repository');
const reportSchema = require('./report-schema.json');
const version = require(path.join(__dirname, '/package.json')).version;

module.exports = { Inspector, Repository, reportSchema, version }
