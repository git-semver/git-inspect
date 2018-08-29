const historyReducer = require('../history-reducer');
const duplicatedMessage = require('./commit/duplicated-message');
const unlinkedTracker = require('./commit/unlinked-tracker');
const shortMessage = require('./commit/short-message');
const longTitle = require('./commit/long-title');

class CommitInspector
{
  constructor(repo, opts = {})
  {
    this.repo = repo;
    this.statistics = Object(null);
    this.statistics.duplicatedMessage = Object(null);
    this.statistics.unlinkedTracker = [];
    this.statistics.shortMessage = [];
    this.statistics.longTitle = [];
    this.opts = opts;

    this.reducers = {
      duplicatedMessage,
      unlinkedTracker,
      shortMessage,
      longTitle
    };
  }

  commitsReducers(commit, statistics)
  {
    this.reducers.each(reducer =>
    {
      statistics = reducer(commit, statistics);
    });

    return statistics;
  }

  async collectCommitsStatistics()
  {
    const history = this.repo.buildHistory();
    this.statistics = await historyReducer(
      history,
      this.commitsReducers,
      this.statistics
    );

    if (this.statistics.duplicatedConditates)
    {
      delete this.statistics.duplicatedConditates;
    }
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
