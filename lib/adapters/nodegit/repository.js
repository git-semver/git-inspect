const path = require('path');
const util = require('util');
const cp = require('child_process');
const Commit = require('./commit');
const Branch = require('./branch');
const git = require('nodegit');

const exec = util.promisify(cp.exec);

class RepositoryAdapter
{
  /**
   * Constructor
   *
   * @constructor
   * @param {string} repositoryDirectory - Path to repository directory
   * @param {Object} config - Adapter config
   */
  constructor(repositoryDirectory, config = {})
  {
    this.repositoryDirectory = path.resolve(repositoryDirectory);
    this.config = config;
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
    this.repo = await git.Repository.open(this.repositoryDirectory);
    this.inited = true;
    return this;
  }

  get directoryPath()
  {
    return this.repo.path();
  }

  get remote()
  {
    return [];
  }

  async getFirstCommit()
  {
    const cmd = 'git rev-list --max-parents=0 HEAD';
    const { stdout, stderr } = await exec(cmd, { cwd: this.repositoryDirectory });
    const oid = stdout.toString();
    const commit = await git.Commit.lookup(this.repo, oid);
    return new Commit(commit);
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
      const references = await this.repo.getReferences(git.Reference.TYPE.LISTALL);
      this.branches = references
        .filter(ref => ref.isBranch())
        .map(ref => new Branch(ref));
    }
    return this.branches;
  }

  /**
   * Build nodegit.Revwalk object
   *
   * @param {Commit} [commit=null] - Commit for push nodegit.Revwalk
   * @param {number} [sortMode=git.Revwalk.SORT.TOPOLOGICAL] - Sorting mode [nodegit.Revwalk.SORT]
   * @return {nodegit.Revwalk}
   */
  async buildWalker(commit = null, sortMode = git.Revwalk.SORT.TOPOLOGICAL)
  {

    const revwalk = git.Revwalk.create(this.repo);
    revwalk.sorting(sortMode);

    if (commit !== null)
    {
      revwalk.push(commit.sha);
    }
    else
    {
      revwalk.pushGlob('refs/heads/*');
    }

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
    return await this.buildWalker(commit, git.Revwalk.SORT.REVERSE);
  }

  /**
   * Build nodegit.Revwalk object with reverse sorting order
   *
   * @param {Commit} commit - Commit for push nodegit.Revwalk
   * @param {number} sortMode - Sorting mode [nodegit.Revwalk.SORT]
   * @return {nodegit.Revwalk}
   */
  async buildTimeWalker(commit)
  {
    return await this.buildWalker(commit, git.Revwalk.SORT.TIME);
  }

  /**
   * Checks that current commit is a descendant of ancestor commit
   *
   * @async
   * @param {git.Commit} currentCommit - Potential descendant commit
   * @param {git.Commit} ancestor - Ancestor commit
   * @return {boolean} Return true if current commit is a descendant
   */
  async isDescendantOf(currentCommit, ancestor)
  {
    const result = await git.Graph.descendantOf(this.repo, currentCommit.id(), ancestor.id());
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
   * @param {Branch} branch
   * @param {Branch[]} upstreamBranches
   * @return {boolean}
   */
  async isObsoleteBranch(branch, upstreamBranches)
  {
    const localBranchRef = branch.source;
    const localHeadCommit = await this.repo.getBranchCommit(localBranchRef);

    // Branch is merged to branches
    const mergedBranches = [];
    // Branch is head for upstream branches
    const aheadBranches = [];
    for (let i in upstreamBranches)
    {
      const upstreamBranchRef = upstreamBranches[i].source;

      if (localBranchRef.name() === upstreamBranchRef.name())
      {
        continue;
      }

      const upstreamHeadCommit = await this.repo.getBranchCommit(upstreamBranchRef);
      const uniqCommits = await git.Graph.aheadBehind(this.repo, upstreamHeadCommit, localHeadCommit);

      if (uniqCommits.ahead === 0)
      {
        aheadBranches.push(upstreamBranches[i].name);
      }

      if (uniqCommits.behind === 0)
      {
        mergedBranches.push(upstreamBranches[i].name);
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
