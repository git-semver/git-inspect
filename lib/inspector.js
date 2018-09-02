const Repository = require('./adapters/nodegit/repository');
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
    const adapter = new Repository(this.directory);
    await adapter.init();

    ////////
    //const head = await adapter.repo.getHeadCommit();
    //console.log('HEAD', head.sha());
    // Всегда возвращает одно и тоже

    ///////
    //const { Branch } = git;
    //const branchIterator = await Branch.iteratorNew(adapter.repo, 3);
    //console.log(branchIterator);
    // Непонятно что такое branchIterator и как с ним работать

    //await adapter.repo.checkoutBranch('refs/heads/develop');
    // Нельзя сделать в bare репозитории

    // const headCommit = await adapter.repo.getBranchCommit('refs/heads/master');
    // console.log(headCommit.sha());
    // !!! работает везде, отдает последний коммит

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
