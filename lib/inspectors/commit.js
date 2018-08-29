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

  dublicatedReduce(commit, acc)
  {
    acc = cloneDeep(acc);
    const { dublicated } = acc;

    const message = commit.message();
    if (dublicated[message])
    {
      dublicated[message] = [...dublicated[message], commit];
    }
    else
    {
      dublicated[message] = [commit];
    }
    acc.dublicated = dublicated;

    return acc;
  }

  commitsReduce(commit, acc)
  {
    acc = cloneDeep(acc);
    acc = dublicatedReduce(commit, acc);
    return acc;
  }

  async aggregateCommitsStatistics()
  {
    const history = this.repo.buildHistory();
    this.statistics = await historyReducer(history,
      this.commitsReduce,
      this.statistics
    );
  }

  processDublicatedCommits()
  {
    const { dublicated } = this.statistics;
    for (msg in dublicated)
    {
      if (dublicated[msg].length === 1)
      {
        delete dublicated[msg];
      }
    }
    this.statistics.dublicated = dublicated;
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
