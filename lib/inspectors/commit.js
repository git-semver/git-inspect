const historyReducer = require('../history-reducer');
const DuplicatedMessage = require('./commit/duplicated-message');
const unlinkedTracker = require('./commit/unlinked-tracker');
const shortMessage = require('./commit/short-message');
const longTitle = require('./commit/long-title');

class CommitInspector
{
  constructor(repo, opts = {})
  {
    this.repo = repo;
    this.report = Object(null);
    this.report.duplicatedMessage = Object(null);
    this.report.unlinkedTracker = [];
    this.report.shortMessage = [];
    this.report.longTitle = [];
    this.opts = opts;

    this.reducers = {
      duplicatedMessage,
      unlinkedTracker,
      shortMessage,
      longTitle
    };
  }

  commitsReducers(commit, report)
  {
    this.reducers.forEach(reducer =>
    {
      report = reducer(commit, report);
    });

    return report;
  }

  async collectCommitsReport()
  {
    const history = this.repo.buildHistory();
    this.report = await this.repo.walkReduce(
      history,
      this.commitsReducers,
      this.report
    );

    this.reducers.forEach(async (reducer) =>
    {
      this.report = await reducer.afterReduce(commit, this.report);
    });
  }

  async report()
  {
    const commits = await this.repo.getCommits();
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
