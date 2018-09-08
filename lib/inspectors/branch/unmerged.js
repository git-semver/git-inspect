const defaultOpts = {};

class GitFlowReducer
{
  constructor(adapter, opts)
  {
    this.opts = { ...defaultOpts, opts };
    this.adapter = adapter;
  }

  async isMerged(branch, branches)
  {
    const name = branch.name();
    if (name === 'ref/head/master' || name === 'ref/head/develop')
    {
      return true;
    }

    return false;
  }

  async protoReduce(unmerged)
  {
    const branches = await this.adapter.getBranches();
    for (let i in branches)
    {
      const branch = branches[i];
      if (!this.isMerged(linear))
      {
        linear[branch.name()] = branch
      }
    }

    return unmerged;
  }

  reduce(branch, unmerged)
  {
    return unmerged;
  }

  afterReduce(unmerged)
  {
    return unmerged;
  }
}

module.exports = GitFlowReducer;
