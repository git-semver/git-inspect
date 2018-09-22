const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');

class Inspector
{
  constructor(adapter)
  {
    this.adapter = adapter;
  }

  async report()
  {
    await this.adapter.init();

    const commitInspector = new CommitInspector(this.adapter);
    const branchInspector = new BranchInspector(this.adapter);

    const report = {};
    report.commit = await commitInspector.collect();
    report.branch = await branchInspector.collect();
    return report;
  }
}

module.exports = Inspector
