const path = require('path');
const git = require('nodegit');
const { Reference } = git;

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
    this.commits = null;
    this.branches = null;
  }

  async init()
  {
    this.repo = await getRepository(this.repositoryDirectory);
    this.history = await getHistory(this.repo);
    this.inited = true;
    return this;
  }

  async getCommits()
  {
    if (this.commits === null)
    {
      this.commits = await getCommits(this.history);
    }

    return this.commits;
  }

  async getBranches()
  {
    if (this.branches === null)
    {
      const references = await this.repo.getReferences(Reference.TYPE.LISTALL);
      this.branches = references.filter(ref => ref.isBranch());
    }
    return this.branches;
  }
}

module.exports = Repository;
