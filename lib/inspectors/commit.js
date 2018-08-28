const historyReducer = require('../history-reducer');

class CommitInspector
{
  constructor(repo)
  {
    this.repo = repo;
  }

  async getCommitsWithDublicatedMessage()
  {
    const history = this.repo.buildHistory();

    const dublicatedCommits = await historyReducer(history, (commit, acc) =>
    {
      if (acc === null)
      {
        acc = Object(null);
      }

      const message = commit.message();
      if (acc[message])
      {
        acc[message] = [...acc[message], commit];
      }
      else
      {
        acc[message] = [commit];
      }

      return Object.assign(Object(null), acc);
    });

    for (msg in dublicatedCommits)
    {
      if (dublicatedCommits[msg].length === 1)
      {
        delete dublicatedCommits[msg];
      }
    }

    return dublicatedCommits;
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
