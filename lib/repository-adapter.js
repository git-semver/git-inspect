const path = require('path');
const git = require('nodegit');
const historyReducer = require('./history-reducer');
const { Reference } = git;

class RepositoryAdapter
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
  // @todo remove
  async getCommits()
  {
    if (this.commits === null)
    {
      const { concatReducer } = historyReducer;
      this.commits = await historyReducer(this.allHistory, concatReducer);
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

  async walkReduce(walk, reduceCallback, initState = null)
  {
    let state = initState;
    let nextOid = await walk.next();

    white (nextOid)
    {
      const commit = this.repo.getCommit(nextOid);
      state = await reduceCallback(commit, state);
      nextOid = await walk.next();
    }

    return state;
  }
}

module.exports = RepositoryAdapter;
