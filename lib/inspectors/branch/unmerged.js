const defaultOpts = {};

// Reduce unmerged and outdated branches
class UnmergedReducer
{
  /**
   *
   * @param {Repository} repository - Repository adapter
   * @param {Object} props -
   */
  constructor(adapter, opts)
  {
    this.opts = { ...defaultOpts, opts };
    this.adapter = adapter;
  }

  /**
   * Return true if branch merged and not outdated,
   * return false if branch outdated and unmerged.
   *
   * @param {Branch} branch - Branch entity
   * @param {Branch[]} branches - Branch references array
   * @return {boolean}
   */
  async isMerged(branch, branches)
  {
    const { name } = branch;
    if (name === 'master' || name === 'develop')
    {
      return true;
    }

    return await this.adapter.isOutdated(branch, branches);
  }

  /**
   * Reduce unmerged branches to unmerge param state
   *
   * @param {Branch} branch - Recuded branch object
   * @param {Object} unmerged - Accumulated object
   * @param {Branch[]} branches - Branch references array
   */
  async reduce(branch, unmerged, branches)
  {
    if (!unmerged.outdated)
    {
      unmerged.outdated = {};
      unmerged.branchesCount = branches.length;
    }

    const isMerged = await this.isMerged(branch, branches)

    if (!isMerged)
    {
      unmerged.outdated[branch.name] = branch;
    }

    return unmerged;
  }

  afterReduce(unmerged)
  {
    return unmerged;
  }
}

module.exports = UnmergedReducer;
