const path = require('path');
const git = require('nodegit');
const historyWalk = require('./history-reducer');
const { Reference } = git;

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

  async buildHistory(commit = null, sortMode = git.Revwalk.SORT.TIME)
  {
    if (commit === null)
    {
      commit = await this.repo.getMasterCommit();
    }
    return commit.history(sortMode);
  }

  async init()
  {
    this.repo = await git.Repository.open(this.repositoryDirectory);
    this.allHistory = await this.buildHistory();
    this.inited = true;
    return this;
  }

  // @deprecated Needs many memory because load all history
  async getCommits()
  {
    if (this.commits === null)
    {
      const { concatReducer } = historyWalk;
      this.commits = await historyWalk(this.allHistory, concatReducer);
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
