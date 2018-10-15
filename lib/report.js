const resultIndexKeySeparator = '/';

const getResultIndexKey = (inspector, reducer) =>
  `${inspector}${resultIndexKeySeparator}${reducer}`

const defaultReport = {
  config: {},
  "repository": {
    "remote": [],
    "directoryPath": null
  },
  "results": [],
  "startTimestamp": null,
  "endTimestamp": null,
  "time": null
};

const reportNotStartedException = 'Report not started';
const resultsIsExistsException = 'Result is now exist';


class Report
{
  /**
   *
   * @constructor
   * @param {Object} config - Configuration
   */
  constructor(config = {})
  {
    this.resultsIndex = {};
    this.startDate = null;
    this.endDate = null;
    this.inst = { ...defaultReport, config };
  }

  /**
   * Add report as result
   *
   * @param {string} inspector - Inspector name
   * @param {string} reducer - Reducer name
   * @param {Any} report - Report
   * @return {Report}
   */
  addResult(inspector, reducer, report)
  {
    if (this.startDate === null)
    {
      throw new Error(reportNotStartedException);
    }

    const key = getResultIndexKey(inspector, reducer);
    if (this.resultsIndex[key] !== undefined)
    {
      throw new Error(resultsIsExistsException);
    }

    this.inst.results.push({
      inspector,
      reducer,
      report
    });
    this.resultsIndex[key] = (this.inst.results.length - 1);

    return this;
  }

  /**
   * Get result
   *
   * @param {string} inspector - Inspector name
   * @param {string} reducer - Reducer name
   * @return {Object}
   */
  getResult(inspector, reducer)
  {
    const key = getResultIndexKey(inspector, reducer);
    const index = this.resultsIndex[key];
    return this.inst.results[index];
  }

  /**
   * Start process reducing
   *
   * @return {Report}
   */
  start()
  {
    this.startDate = new Date();
    this.inst.startTimestamp =
      this.startDate.toISOString();
    return this;
  }

  /**
   * End process
   *
   * @return {Report}
   */
  end()
  {
    if (this.startDate === null)
    {
      throw new Error(reportNotStartedException);
    }

    this.endDate = new Date();
    this.inst.endTimestamp =
      this.endDate.toISOString();
    this.inst.time = this.endDate - this.startDate;
    return this;
  }

  /**
   * Get report instance
   *
   * @return {Object}
   */
  getInstance()
  {
    return this.inst;
  }
}

Report.getResultIndexKey = getResultIndexKey;
Report.resultIndexKeySeparator = resultIndexKeySeparator;
Report.defaultReport = defaultReport;
Report.resultsIsExistsException = resultsIsExistsException;
Report.reportNotStartedException = reportNotStartedException;

module.exports = Report;
