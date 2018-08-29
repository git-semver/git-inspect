const cloneDeep = require('lodash/cloneDeep');
const historyReducer = require('../history-reducer');

class CommitInspector
{
  constructor(repo)
  {
    this.repo = repo;
    this.statistics = Object(null);
    this.statistics.duplicated = Object(null);
    this.statistics.unlinked = [];
    this.statistics.short = [];
  }

  duplicatedReduce(commit, statistics)
  {
    const { duplicated } = statistics;
    let { duplicatedConditates } = statistics;

    if (!duplicatedConditates)
    {
      duplicatedConditates = Object(null);
    }

    const message = commit.message();

    if (duplicated[message])
    {
      duplicated[message] = [...duplicated[message], commit];
    }
    else if (duplicatedConditates[message])
    {
      duplicated[message] = [...duplicatedConditates[message], commit];
      delete duplicatedConditates[message];
    }
    else
    {
      duplicatedConditates[message] = [commit];
    }

    return { ...statistics, duplicated, duplicatedConditates };
  }

  commitsReduce(commit, statistics)
  {
    statistics = cloneDeep(statistics);
    statistics = duplicatedReduce(commit, statistics);
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
