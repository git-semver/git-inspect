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

    const inspectors = {};
    inspectors[CommitInspector.reportName] = new CommitInspector(this.adapter);
    inspectors[BranchInspector.reportName] = new BranchInspector(this.adapter);

    const report = {};
    for (const reportName in inspectors)
    {
      report[reportName] = await inspectors[reportName].collect();
    }
    return report;
  }
}

module.exports = Inspector
