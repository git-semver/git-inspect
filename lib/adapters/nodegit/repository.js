const path = require('path');
const Commit = require('./commit');

class RepositoryAdapter
{
  /**
   * Constructor
   *
   * @constructor
   * @param {string} repositoryDirectory - Path to repository directory
   * @param {Object} driver - Driver for integration with git repository
   */
  constructor(repositoryDirectory, driver, options = {})
  {
    this.git = driver;
    this.repositoryDirectory = path.resolve(repositoryDirectory);
    this.options = options;
    this.inited = false;
    this.commits = null;
    this.branches = null;
  }

  async buildHistory(commit = null, sortMode = null)
  {
    if (sortMode === null)
    {
      sortMode = this.git.Revwalk.SORT.TIME;
    }

    if (commit === null)
    {
      commit = await this.repo.getMasterCommit();
    }
    return commit.history(sortMode);
  }

  /**
   * Open repository and init accessory things
   *
   * @async
   * @return {RepositoryAdapter}
   */
  async init()
  {
    this.repo = await this.git.Repository.open(this.repositoryDirectory);
    this.allHistory = await this.buildHistory();
    this.inited = true;
    return this;
  }

  async getBranches()
  {
    if (this.branches === null)
    {
      const references = await this.repo.getReferences(this.git.Reference.TYPE.LISTALL);
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
  async buildWalker(commit = null, sortMode = null)
  {
    if (sortMode === null)
    {
      sortMode = this.git.Revwalk.SORT.TOPOLOGICAL;
    }

    if (commit === null)
    {
      commit = await this.repo.getMasterCommit();
    }
    const revwalk = this.git.Revwalk.create(this.repo);
    revwalk.sorting(sortMode);
    revwalk.push(commit.id());
    return revwalk;
  }

  async buildReverseWalker(commit)
  {
    return await this.buildWalker(commit, this.git.Revwalk.SORT.REVERSE);
  }

  /**
   * Checks that current commit is a descendant of ancestor commit
   *
   * @async
   * @param {Commit} currentCommit - Potential descendant commit
   * @param {Commit} ancestor - Ancestor commit
   * @return {boolean} Return true if current commit is a descendant
   */
  async isDescendantOf(currentCommit, ancestor)
  {
    const result = await this.git.Graph.descendantOf(adapter.repo, currentCommit.id, ancestor.id);
    return result === 1;
  }

  /**
   * This callback type is called `reduceCallback` and is reduce commits to state.
   *
   * @callback reduceCallback
   * @async
   * @param {Commit} commit - Commit for reduce state
   * @param {Object} state - Reducing state
   * @return {Promise<Object>} - Reduced state
   */

  /**
   * Reduce state by walking in history
   *
   * @param {nodegit.Revwalk} walk - Revwalk builded and configured object
   * @param {reduceCallback} reduceCallback - The callback that reduce the commits to state
   * @param {*} initState - Initial state for reducing
   */
  async walkReduce(walk, reduceCallback, initState = null)
  {
    let state = initState;
    let nextOid = await walk.next();

    while (nextOid)
    {
      const com = await this.repo.getCommit(nextOid)
      const commit = new Commit(com);
      state = await reduceCallback(commit, state)

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
