const path = require('path');
const Commit = require('./commit');
const Branch = require('./branch');

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

  /**
   * Open repository and init accessory things
   *
   * @async
   * @return {RepositoryAdapter}
   */
  async init()
  {
    this.repo = await this.git.Repository.open(this.repositoryDirectory);
    this.inited = true;
    return this;
  }

  /**
   * Return branch array
   *
   * @return {Branch[]}
   */
  async getBranches()
  {
    if (this.branches === null)
    {
      const references = await this.repo.getReferences(this.git.Reference.TYPE.LISTALL);
      this.branches = references
        .filter(ref => ref.isBranch())
        .map(ref => new Branch(ref));
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
      commit = new Commit(await this.repo.getMasterCommit());
    }
    const revwalk = this.git.Revwalk.create(this.repo);
    revwalk.sorting(sortMode);
    revwalk.push(commit.sha);
    return revwalk;
  }

  /**
   * Build nodegit.Revwalk object with reverse sorting order
   *
   * @param {Commit} commit - Commit for push nodegit.Revwalk
   * @param {number} sortMode - Sorting mode [nodegit.Revwalk.SORT]
   * @return {nodegit.Revwalk}
   */
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
    const result = await this.git.Graph.descendantOf(this.repo, currentCommit.id(), ancestor.id());
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

  /**
   * Return head commit of branche
   *
   * @param {Branch}
   * @return {Commit}
   */
  async getBranchHead(branch)
  {
    const head = await this.repo.getBranchCommit(branch.ref);
    return new Commit(head);
  }

  /**
   * Return true if topic branch is obsolete about all other branches
   *
   * @param {Branch}
   * @param {Branch[]}
   * @return {boolean}
   */
  async isObsoleteBranch(branch, branches)
  {
    const localBranchRef = branch.source;
    const localHeadCommit = await this.repo.getBranchCommit(localBranchRef);

    // Branch is merged to branches
    const mergedBranches = [];
    // Branch is head for upstream branches
    const aheadBranches = [];

    for (let i in branches)
    {
      const upstreamBranchRef = branches[i].source;

      if (localBranchRef.name() === upstreamBranchRef.name())
      {
        continue;
      }

      const upstreamHeadCommit = await this.repo.getBranchCommit(upstreamBranchRef);
      const uniqCommits = await this.git.Graph.aheadBehind(this.repo, upstreamHeadCommit, localHeadCommit);

      if (uniqCommits.ahead === 0)
      {
        aheadBranches.push(branches[i].name);
      }

      if (uniqCommits.behind === 0)
      {
        mergedBranches.push(branches[i].name);
      }
    }

    if (aheadBranches.length === 0 && mergedBranches.length === 0)
    {
      return true;
    }

    return false;
  }
}

module.exports = RepositoryAdapter;
