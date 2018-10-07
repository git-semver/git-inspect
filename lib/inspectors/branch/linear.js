const sum = require('lodash/sum');
const Commit = require('../../adapters/nodegit/commit');

const defaultOpts = { minLinearFactor: 0.001, accuracy: 3 };

class LinearBranchReducer
{
  constructor(adapter, opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
    this.accuracyFactor = Math.pow(10, this.opts.accuracy);
    this.adapter = adapter;
  }

  async getGraphInfo(branch)
  {
    const cousins = [];
    const headCommit = await this.adapter.getBranchHead(branch);
    // TODO await this.adapter.buildTimeWalker(null); with sleep between commits
    const walk = await this.adapter.buildWalker(headCommit);
    // TODO refactoring for adapter commits
    const commits = await walk.getCommits();

    for (let i = 0; i < commits.length - 1; i++)
    {
      const cur = commits[i];
      const anc = commits[i + 1];
      const isDescendant = await this.adapter.isDescendantOf(cur, anc);

      if (!isDescendant)
      {
        cousins.push(new Commit(cur));
      }
    }

    let linearFactor = this.opts.minLinearFactor;

    if (commits.length > cousins.length)
    {
      linearFactor = (commits.length - cousins.length) / commits.length;
    }

    return {
      cousins,
      linearFactor: Math.floor(linearFactor * this.accuracyFactor) / this.accuracyFactor
    };
  }

  async reduce(branch, linear)
  {
    if (!linear.linearFactors)
    {
      linear.linearFactors = [];
    }

    if (!linear.branches)
    {
      linear.branches = {};
    }

    const graphInfo = await this.getGraphInfo(branch);
    const { linearFactor } = graphInfo;

    linear.linearFactors.push(linearFactor);
    linear.branches[branch.name] = { ...graphInfo };
    return linear;
  }

  afterReduce(linear)
  {
    const factor = sum(linear.linearFactors) / linear.linearFactors.length;
    linear.linearFactor = Math.floor(factor * this.accuracyFactor) / this.accuracyFactor;
    delete linear.linearFactors;
    return linear;
  }
}

module.exports = LinearBranchReducer;
