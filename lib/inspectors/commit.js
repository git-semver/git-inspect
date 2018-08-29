const cloneDeep = require('lodash/cloneDeep');
const historyReducer = require('../history-reducer');

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
  }

  duplicatedMessageReduce(commit, statistics)
  {
    const { duplicatedMessage } = statistics;
    let { duplicatedConditates } = statistics;

    if (!duplicatedConditates)
    {
      duplicatedConditates = Object(null);
    }

    const message = commit.message();

    if (duplicatedMessage[message])
    {
      duplicatedMessage[message] = [...duplicatedMessage[message], commit];
    }
    else if (duplicatedConditates[message])
    {
      duplicatedMessage[message] = [...duplicatedConditates[message], commit];
      delete duplicatedConditates[message];
    }
    else
    {
      duplicatedConditates[message] = [commit];
    }

    return { ...statistics, duplicatedMessage, duplicatedConditates };
  }

  unlinkedTrackerReduce(commit, statistics)
  {
    const { unlinkedTracker } = statistics;

    // Find unlinked issue tracker commits

    return { ...statistics, unlinkedTracker };
  }

  shortMessageReduce(commit, statistics)
  {
    const { shortMessage } = statistics;

    // Find commits with short message

    return { ...statistics, shortMessage };
  }

  longTitleReduce(commit, statistics)
  {
    const { longTitle } = statistics;

    // Find commits with long title in message

    return { ...statistics, longTitle };
  }

  commitsReduce(commit, statistics)
  {
    statistics = cloneDeep(statistics);
    statistics = duplicatedMessageReduce(commit, statistics);
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
