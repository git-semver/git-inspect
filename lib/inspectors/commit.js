const DuplicatedMessageReducer = require('./commit/duplicated-message');

const UnlinkedTrackerReducer = require('./commit/unlinked-tracker');
const ShortMessageReducer = require('./commit/short-message');
const LongTitleReducer = require('./commit/long-title');
const TotalCommitsReducer = require('./commit/total');

const reducerNames = {
  duplicatedMessage: 'duplicatedMessage',
  unlinkedTracker: 'unlinkedTracker',
  shortMessage: 'shortMessage',
  longTitle: 'longTitle',
  total: 'total'
};

const getDefaultReport = () => ({
  [reducerNames.duplicatedMessage]: null,
  [reducerNames.unlinkedTracker]: null,
  [reducerNames.shortMessage]: null,
  [reducerNames.longTitle]: null,
  [reducerNames.total]: null
});

class CommitInspector
{
  constructor(adapter, opts = {})
  {
    this.adapter = adapter;
    this.report = getDefaultReport();
    this.opts = { ...opts };

    this.reducers = {
      [reducerNames.duplicatedMessage]: new DuplicatedMessageReducer(this.opts[reducerNames.duplicatedMessage]),
      [reducerNames.unlinkedTracker]: new UnlinkedTrackerReducer(this.opts[reducerNames.unlinkedTracker]),
      [reducerNames.shortMessage]: new ShortMessageReducer(this.opts[reducerNames.shortMessage]),
      [reducerNames.longTitle]: new LongTitleReducer(this.opts[reducerNames.longTitle]),
      [reducerNames.total]: new TotalCommitsReducer(this.opts[reducerNames.total])
    };
  }

  async commitsReducers(commit, report)
  {
    for (let reducerName in this.reducers)
    {
      const reducer = this.reducers[reducerName];
      report[reducerName] = await reducer.reduce(commit, report[reducerName]);
    }

    return report;
  }

  async collectCommitsReport()
  {
    const walker = await this.adapter.buildWalker();
    this.report = await this.adapter.walkReduce(
      walker,
      this.commitsReducers.bind(this),
      this.report
    );

    for (let reducerName in this.reducers)
    {
      const reducer = this.reducers[reducerName];
      this.report[reducerName] = await reducer.afterReduce(this.report[reducerName]);
    }
  }

  async collect()
  {
    await this.collectCommitsReport()
    return this.report;
  }
}

CommitInspector.inspectorName = 'commit';
CommitInspector.reducerNames = reducerNames;

module.exports = CommitInspector;
