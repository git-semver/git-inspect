#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const ora = require('ora');
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
  const spinner = ora('Inspecting repository ...').start();
  const report = await new Promise((resolve, reject) => {
    inspector.report().then(report =>
      {
        spinner.succeed('Completed');
        resolve(report);
      })
      .catch(reject);
  });
  spinner.clear(true);
  setTimeout(() =>
  {

    console.log(JSON.stringify(report, 2, ' '));
  }, 1000);
})();
