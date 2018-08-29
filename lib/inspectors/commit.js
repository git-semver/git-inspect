const cloneDeep = require('lodash/cloneDeep');
const historyReducer = require('../history-reducer');

class CommitInspector
{
  constructor(repo)
  {
    this.repo = repo;
    this.statistics = Object(null);
    this.statistics.dublicated = Object(null);
    this.statistics.unlinked = [];
    this.statistics.short = [];
  }

  dublicatedReduce(commit, statistics)
  {
    const { dublicated } = statistics;
    let { dublicatedConditates } = statistics;

    if (!dublicatedConditates)
    {
      dublicatedConditates = Object(null);
    }

    const message = commit.message();

    if (dublicated[message])
    {
      dublicated[message] = [...dublicated[message], commit];
    }
    else if (dublicatedConditates[message])
    {
      dublicated[message] = [...dublicatedConditates[message], commit];
      delete dublicatedConditates[message];
    }
    else
    {
      dublicatedConditates[message] = [commit];
    }

    return { ...statistics, dublicated, dublicatedConditates };
  }

  commitsReduce(commit, statistics)
  {
    statistics = cloneDeep(statistics);
    statistics = dublicatedReduce(commit, statistics);
    return statistics;
  }

  async collectCommitsStatistics()
  {
    const history = this.repo.buildHistory();
    this.statistics = await historyReducer(
      history,
      this.commitsReduce,
      this.statistics
    );

    if (this.statistics.dublicatedConditates)
    {
      delete this.statistics.dublicatedConditates;
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
