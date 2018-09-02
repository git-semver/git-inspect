const DuplicatedMessageReducer = require('./commit/duplicated-message');
const UnlinkedTrackerReducer = require('./commit/unlinked-tracker');
const ShortMessageReducer = require('./commit/short-message');
const LongTitleReducer = require('./commit/long-title');

const reducerNames = {
  duplicatedMessage: 'duplicatedMessage',
  unlinkedTracker: 'unlinkedTracker',
  shortMessage: 'shortMessage',
  longTitle: 'longTitle'
};

const getDefaultReport = () => ({
  [reducerNames.duplicatedMessage]: Object.create(null),
  [reducerNames.unlinkedTracker]: [],
  [reducerNames.shortMessage]: [],
  [reducerNames.longTitle]: [],
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
      [reducerNames.longTitle]: new LongTitleReducer(this.opts[reducerNames.longTitle])
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
    const history = this.adapter.buildWalker();
    this.report = await this.adapter.walkReduce(
      history,
      this.commitsReducers,
      this.report
    );

    for (let reducerName in this.reducers)
    {
      const reducer = this.reducers[reducerName];
      this.report[reducerName] = await reducer.afterReduce(commit, this.report[reducerName]);
    }
  }

  async report()
  {
    const commits = await this.adapter.getCommits();
    const report = { commits: [] };

    commits.forEach((commit) =>
    {
      let commitInfo = '';
      commitInfo = commitInfo.concat("commit " + commit.sha());
      commitInfo = commitInfo.concat("Author:", commit.author().name() +
      " <" + commit.author().email() + ">");
      commitInfo = commitInfo.concat("Date:", commit.date());
      commitInfo = commitInfo.concat("\n    " + commit.message());
      report.commits.push(commitInfo);
    });

    return report;
  }
}

module.exports = CommitInspector;
