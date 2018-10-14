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
    inspectors[CommitInspector.inspectorName] = new CommitInspector(this.adapter);
    inspectors[BranchInspector.inspectorName] = new BranchInspector(this.adapter);
    const report = {};
    for (const name in inspectors)
    {
      report[name] = await inspectors[name].collect();
    }

    return report;
  }
}

module.exports = Inspector
