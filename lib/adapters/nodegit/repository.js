const path = require('path');
const git = require('nodegit');
const Commit = require('./commit');
const { Reference } = git;

class RepositoryAdapter
{
  /**
   * Constructor
   *
   * @constructor
   * @param {string} repositoryDirectory - Path to repository directory
   * @param {}
   */
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

  async getBranches()
  {
    if (this.branches === null)
    {
      const references = await this.repo.getReferences(Reference.TYPE.LISTALL);
      this.branches = references.filter(ref => ref.isBranch());
    }
    return this.branches;
  }

  /**
   * Build nodegit.Revwalk object
   *
   * @param {Commit} commit - Commit for push nodegit.Revwalk
   * @param {number} sortMode - Sorting mode [nodegit.Revwalk.SORT]
   * @return {nodegit.Revwalk}
   */
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

  /**
   * This callback type is called `reduceCallback` and is reduce commits to state.
   *
   * @callback reduceCallback
   * @param {Commit} commit
   * @param {Object} state
   */

  /**
   * Reduce state by walking in history
   *
   * @param {nodegit.Revwalk} walk - Revwalk builded and configured object
   * @param {reduceCallback} reduceCallback - The callback that reduce the commits to state
   */
  async walkReduce(walk, reduceCallback, initState = null)
  {
    let state = initState;
    let nextOid = await walk.next();
    const callback = async (commit, state) => await reduceCallback(commit, state);

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
