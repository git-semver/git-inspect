const CommitInspector = require('./inspectors/commit');
const BranchInspector = require('./inspectors/branch');
const Report = require('./report');

class Inspector
{
  constructor(adapter, config)
  {
    this.adapter = adapter;
    this.config = config;
    this.report = new Report(this.config);
  }

  /**
   * Collect and get report
   *
   * @return {Report} - Report object
   */
  async collect()
  {
    this.report.start();
    await this.adapter.init();
    this.report.fillRepository(this.adapter);

    const inspectors = {};
    inspectors[CommitInspector.inspectorName] = new CommitInspector(this.adapter);
    inspectors[BranchInspector.inspectorName] = new BranchInspector(this.adapter);

    for (const inspectorName in inspectors)
    {
      const inspectorReport = await inspectors[inspectorName].collect();
      for (let reducerName in inspectorReport)
      {
        const result = inspectorReport[reducerName];
        this.report.addResult(inspectorName, reducerName, result);
      }
    }
    this.report.end();
    return this.report;
  }
}

module.exports = Inspector
