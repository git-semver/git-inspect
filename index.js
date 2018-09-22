#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const Inspector = require('./lib/inspector');
const Repository = require('./lib/adapters/nodegit/repository');

const version = require(path.join(__dirname, '/package.json')).version;
const defaultWorkDirectory = process.cwd();

let currentWorkDirectory = null;

program
  .version(version, '-v, --version')
  .arguments('[cwd]')
  .action(cwd => { currentWorkDirectory = cwd || defaultWorkDirectory; })
  .parse(process.argv);

(async function()
{
  const adapter = new Repository(currentWorkDirectory)
  const inspector = new Inspector(adapter);
  const report = await inspector.report();
  console.log(JSON.stringify(report, 2, ' '));
})();
