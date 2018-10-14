#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const ora = require('ora');
const merge = require('lodash/merge');
const cosmiconfig = require('cosmiconfig');

const Inspector = require('../lib/inspector');
const Repository = require('../lib/adapters/nodegit/repository');

const version = require(path.join(__dirname, '..', 'package.json')).version;
const defaultWorkDirectory = process.cwd();

const defaultConfigPath = path.join(__dirname, '..', 'configs', 'default.json');
const configName = 'git-inspect';
const configOpts = {
  searchPlaces: [
    `.${configName}`,
    `.${configName}.json`,
    `.${configName}.yaml`,
    `.${configName}.yml`,
    `.${configName}.js`
  ],
  loaders: {
    noExt: cosmiconfig.loadJson
  }
};
const configExplorer = cosmiconfig(configName, configOpts);
let currentWorkDirectory = null;

program
  .version(version, '-v, --version')
  .arguments('[cwd]')
  .action(cwd => { currentWorkDirectory = cwd || defaultWorkDirectory; })
  .parse(process.argv);

(async function()
{
  let defaultConfig = require(defaultConfigPath);
  let config = {};
  try {
    config = await configExplorer.search(currentWorkDirectory);
    config = merge(config, defaultConfig);
  }
  catch (e)
  {
    config = { ...defaultConfig };
  }



  const adapter = new Repository(currentWorkDirectory, config.repository);
  const inspector = new Inspector(adapter, config);
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
