
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
  constructor(adapter, opts)
  {
    this.opts = { ...defaultOpts, opts };
    this.adapter = adapter;
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

    return await this.adapter.isObsoleteBranch(branch, branches);
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
      obsolete.obsoleteBranches = {};
      obsolete.branchesCount = branches.length;
    }

    if (await this.isObsolete(branch, branches))
    {
      obsolete.obsoleteBranches[branch.name] = branch;
    }

    return obsolete;
  }

  afterReduce(obsolete)
  {
    return obsolete;
  }
}

module.exports = UnmergedReducer;
