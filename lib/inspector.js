const Repository = require('./repository');
const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');
const GitFlowInspector = require('./inspectors/git-flow');

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
    const gitFlowInspector = new GitFlowInspector(repo);
    report.commit = await commitInspector.report();
    report.branch = await branchInspector.report();
    report.gitFlow = await gitFlowInspector.report();
    return report;
  }
}

module.exports = Inspector
