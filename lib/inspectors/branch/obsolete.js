
const trunkBranches = ['master', 'develop'];
const defaultOpts = { trunkBranches };

// Reduce unmerged and outdated branches
class UnmergedReducer
{
  /**
   *
   * @param {Repository} repository - Repository adapter
   * @param {Object} opts - Reducer opts
   */
  constructor(adapter, opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
    this.adapter = adapter;
    this.trunkBranches = [];
  }

  /**
   * Return true if obsolete branch ,
   * return false if not obsolete branch.
   *
   * @param {Branch} branch - Branch entity
   * @param {Branch[]} branches - Branch references array
   * @return {boolean}
   */
  async isObsolete(branch, branches)
  {
    const { name } = branch;
    if (this.opts.trunkBranches.indexOf(name) !== -1)
    {
      return false;
    }

    const upstreamBranches = this.getUpstreamBranches(branches);
    return await this.adapter.isObsoleteBranch(branch, upstreamBranches);
  }

  /**
   * Return upstream branches
   *
   * @param {Branch[]} allBranches - Array of all branches
   * @return {Branch[]}
   */
  getUpstreamBranches(allBranches)
  {
    if (!this.opts.trunkBranches || this.opts.trunkBranches.length === 0)
    {
      return allBranches;
    }

    if (this.trunkBranches.length > 0)
    {
      return this.trunkBranches;
    }

    for (let i in allBranches)
    {
      const branch = allBranches[i];
      if (this.opts.trunkBranches.indexOf(branch.name) !== -1)
      {
        this.trunkBranches.push(branch);
      }
    }
    return [...this.trunkBranches];
  }

  /**
   * Reduce obsolete branches to obsolete param state
   *
   * @param {Branch} branch - Reduced branch object
   * @param {Object} obsolete - Accumulated object
   * @param {Branch[]} branches - Branch references array
   */
  async reduce(branch, obsolete, branches)
  {
    if (!obsolete.obsoleteBranches)
    {
      obsolete.branches = [];
    }

    if (await this.isObsolete(branch, branches))
    {
      obsolete.branches.push({ name: branch.name });
    }

    return obsolete;
  }

  afterReduce(obsolete)
  {
    return obsolete;
  }
}

module.exports = UnmergedReducer;
