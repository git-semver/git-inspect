const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');
const Report = require('./report');

class Inspector
{
  constructor(adapter, config)
  {
    this.adapter = adapter;
    this.config = config;
    this.reportInstance = new Report(this.config);
  }

  /**
   * Collect and get report
   *
   * @return {Report} - Report object
   */
  async collect()
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
