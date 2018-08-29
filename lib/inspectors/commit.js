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
    const message = commit.message();

    if (dublicated[message])
    {
      dublicated[message] = [...dublicated[message], commit];
    }
    else
    {
      dublicated[message] = [commit];
    }

    return { ...statistics, dublicated };
  }

  commitsReduce(commit, statistics)
  {
    statistics = cloneDeep(statistics);
    statistics = dublicatedReduce(commit, statistics);
    return statistics;
  }

  removeNotDublicatedCommits(dublicated)
  {
    dublicated = { ...dublicated };

    for (let msg in dublicated)
    {
      if (dublicated[msg].length <= 1)
      {
        delete dublicated[msg];
      }
    }

    return dublicated;
  }

  async aggregateCommitsStatistics()
  {
    const history = this.repo.buildHistory();
    this.statistics = await historyReducer(
      history,
      this.commitsReduce,
      this.statistics
    );
    this.statistics.dublicated =
      this.removeNotDublicatedCommits(this.statistics.dublicated);
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
