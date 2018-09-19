const sum = require('lodash/sum');

const defaultOpts = {};

class LinearBranchReducer
{
  constructor(adapter, opts)
  {
    this.opts = { ...defaultOpts, opts };
    this.adapter = adapter;
  }

  async getGraphInfo(branch)
  {
    const cousin = [];
    const headCommit = await this.adapter.repo.getBranchCommit(branch);
    const walk = await this.adapter.buildWalker(headCommit);
    const commits = await walk.getCommits();

    for (let i = 0; i < commits.length - 1; i++)
    {
      const cur = commits[i];
      const anc = commits[i + 1];
      const res = await this.adapter.descendantOf(cur.id(), anc.id());

      if (res === 0)
      {
        cousin.push(cur);
      }
    }

    const linearFactor = (commits.length - cousin.length) / commits.length;

    return {
      cousin,
      linearFactor
    };
  }

  async protoReduce(linear)
  {
    const branches = await this.adapter.getBranches();
    const linerFactors = [];
    for (let i in branches)
    {
      const branch = branches[i];
      const graphInfo = await this.getGraphInfo(branch.ref);
      const { linerFactor } = graphInfo;

      linerFactors.push(linerFactor);
      linear[branch.name] = { graphInfo: graphInfo };
    }

    linear.linerFactor = sum(linerFactors) / linerFactors.length;

    return linear;
  }

  reduce(branch, linear)
  {
    return linear;
  }

  afterReduce(linear)
  {
    return linear;
  }
}

module.exports = LinearBranchReducer;
