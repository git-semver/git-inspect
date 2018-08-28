class CommitInspector
{
  constructor(repo)
  {
    this.repo = repo;
  }

  getCommitsWithDublicatedMessage(commits)
  {
    const dublicatedCommits = Object(null);

    commits.forEach((commit) => {
      const message = commit.message();
      if (dublicatedCommits[message])
      {
        dublicatedCommits[message].push(commit);
      }
      else
      {
        dublicatedCommits[message] = [commit];
      }
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
