const path = require('path');
const git = require('nodegit');
const historyReducer = require('../../history-reducer');
const Commit = require('./commit');
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

  async buildWalker(commit = null, sortMode = git.Revwalk.SORT.TOPOLOGICAL)
  {
    if (commit === null)
    {
      commit = await this.repo.getMasterCommit();
    }
    const revwalk = git.Revwalk.create(this.repo);
    revwalk.sorting(sortMode);
    revwalk.push(commit.id());
    return revwalk;
  }

  async descendantOf(commit, ancestor)
  {
    const result = await git.Graph.descendantOf(adapter.repo, cur.id, anc.id);
    return result === 1;
  }

  async buildReverseWalker(commit)
  {
    return await this.buildWalker(commit, git.Revwalk.SORT.REVERSE);
  }

  async walkReduce(walk, reduceCallback, initState = null)
  {
    let state = initState;
    let nextOid = await walk.next();
    const callback = async (commit, state) => reduceCallback(commit, state);
    while (nextOid)
    {
      const com = await this.repo.getCommit(nextOid)
      const commit = new Commit(com);
      state = await callback(commit, state)

      try
      {
        nextOid = await walk.next();
      }
      catch(err)
      {
        nextOid = null;
      }
    }

    return state;
  }
}

module.exports = RepositoryAdapter;
