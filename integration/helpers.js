const { join } = require('path');
const { mkdirSync, existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync } = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);
const { Inspector, schema, Repository } = require('../index');
const Ajv = require('ajv');

const scriptsPath = join(__dirname, 'scripts');
const garderPath = join(__dirname, 'garden');

function rimraf(dir_path) {
  if (existsSync(dir_path)) {
    readdirSync(dir_path).forEach(function(entry) {
      var entry_path = join(dir_path, entry);
      if (lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        unlinkSync(entry_path);
      }
    });
    rmdirSync(dir_path);
  }
}

async function createRepository(repoName)
{
  const repositoryPath = join(garderPath, repoName);
  const command = join(scriptsPath, `${repoName}.sh`);
  mkdirSync(repositoryPath);
  const { error } = await execAsync(command, { cwd: repositoryPath });
  if (error) { throw error; }
  return repositoryPath;
}

function clearGarden(repoName)
{
  const repositoryPath = join(garderPath, repoName);
  rimraf(repositoryPath);
  return repositoryPath;
}

async function inspect(caseName)
{
  const cwd = await createRepository(caseName);
  const adapter = new Repository(cwd);
  return new Inspector(adapter);
}

class SchemaValidator
{
  constructor()
  {
    this.ajv = new Ajv();
  }

  get errors(){
    return this.ajv.errors;
  }

  validate(report)
  {
    return this.ajv.validate(schema, JSON.parse(JSON.stringify(report)));;
  };
}

module.exports = {
  createRepository,
  clearGarden,
  inspect,
  SchemaValidator
};
