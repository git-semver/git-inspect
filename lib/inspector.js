const RepositoryAdapter = require('./repository-adapter');
const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');
const GitFlowInspector = require('./inspectors/git-flow');
const git = require('nodegit');

class Inspector
{
  constructor(directory)
  {
    this.directory = directory;
  }

  async report()
  {
    const report = {};
    const adapter = new RepositoryAdapter(this.directory);
    await adapter.init();

    ////////
    //const head = await adapter.repo.getHeadCommit();
    //console.log('HEAD', head.sha());

    ///////
    //const { Branch } = git;
    //const branchIterator = await Branch.iteratorNew(adapter.repo, 3);
    //console.log(branchIterator);

    await adapter.repo.checkoutBranch('refs/heads/develop');

    return;
    const commitInspector = new CommitInspector(adapter);
    const branchInspector = new BranchInspector(adapter);
    const gitFlowInspector = new GitFlowInspector(adapter);
    report.commit = await commitInspector.report();
    report.branch = await branchInspector.report();
    report.gitFlow = await gitFlowInspector.report();
    return report;
  }
}

module.exports = Inspector
