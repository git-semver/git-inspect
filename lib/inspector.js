const Repository = require('./repository');
const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');

class Inspector
{
  constructor(directory)
  {
    this.directory = directory;
  }

  async report()
  {
    const report = {};
    const repo = new Repository(this.directory);
    await repo.init();
    const commitInspector = new CommitInspector(repo);
    const branchInspector = new BranchInspector(repo);
    report.commit = await commitInspector.report();
    report.branch = await branchInspector.report();
    return report;
  }
}

module.exports = Inspector
