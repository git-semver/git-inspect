const path = require('path');
const git = require('nodegit');

const getRepository = async function(repositoryDirectory)
{
  const repo = await git.Repository.open(repositoryDirectory);
  return repo;
}

const getHistory = async function(repo)
{
  const firstCommit = await repo.getMasterCommit();
  const history = firstCommit.history(git.Revwalk.SORT.TIME);
  return history;
}

const getCommits = async function(history)
{
  const historyWalk = () => new Promise((resolve, reject) =>
  {
    const commits = [];
    history.on('commit', commit => commits.push(commit));
    history.on('end', () => resolve(commits));
    history.on('error', reject);
  });
  history.start();
  const commits = await historyWalk();
  return commits;
}

class Repository
{
  constructor(repositoryDirectory, options = {})
  {
    this.repositoryDirectory = path.resolve(repositoryDirectory);
    this.options = options;
    this.inited = false;
  }

  async init()
  {
    this.repo = await getRepository(this.repositoryDirectory);
    this.history = await getHistory(this.repo);
    this.inited = true;
    return this;
  }

  async commits()
  {
    const commits = await getCommits(this.history);
    return commits;
  }
}

module.exports = Repository;
