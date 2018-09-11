const Repository = require('./adapters/nodegit/repository');
const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');

class Inspector
{
  constructor(directory, driver)
  {
    this.directory = directory;
    this.driver = driver;
  }

  async report()
  {
    const report = {};
    const adapter = new Repository(this.directory, this.driver);
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

    /*
    if 0 then current commit is not descendanted
    const headCommit = await adapter.repo.getBranchCommit('refs/heads/master');
    const walk = await adapter.buildWalker(headCommit);
    const commits = await walk.getCommits();
    for (let i = 0; i < commits.length - 1; i++)
    {
      //const count = commits[i].message();
      //console.log(count);
      const cur = commits[i];
      const anc = commits[i + 1];
      const res = await git.Graph.descendantOf(adapter.repo, cur.id(), anc.id());
      console.log(res, cur.message());
    };
    */

    const commitInspector = new CommitInspector(adapter);
    const branchInspector = new BranchInspector(adapter);
    report.commit = await commitInspector.collect();
    report.branch = await branchInspector.collect();
    return report;
  }
}

module.exports = Inspector
