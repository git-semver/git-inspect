const GitflowReducer = require('./branch/gitflow');
const LinearReducer = require('./branch/linear');
const UnmergedReducer = require('./branch/unmerged');

const reducerNames = {
  gitflow: 'gitflow',
  linear: 'linear',
  unmerged: 'unmerged'
};

const getDefaultReport = () => ({
  [reducerNames.gitflow]: Object.create(null),
  [reducerNames.linear]: Object.create(null),
  [reducerNames.unmerged]: []
});

class BranchInspector
{
  constructor(adapter, opts = {})
  {
    this.adapter = adapter;
    this.opts = opts;
    this.report = getDefaultReport();
    this.reducers = {
      [reducerNames.gitflow]: new GitflowReducer(this.opts[reducerNames.gitflow]),
      [reducerNames.linear]: new LinearReducer(this.opts[reducerNames.linear]),
      [reducerNames.unmerged]: new UnmergedReducer(this.opts[reducerNames.unmerged])
    };
  }

  async collect()
  {
    const branches = await this.adapter.getBranches();
    for (let i in branches)
    {
      const branch = branches[i];

      for (let reducerName in this.reducers)
      {
        const reducer = this.reducers[reducerName];
        this.report[reducerName] = await reducer.reduce(branch, this.report[reducerName]);
      }
    }

    return this.report;
  }
}

BranchInspector.getDefaultReport = getDefaultReport;
BranchInspector.reducerNames = reducerNames;

module.exports = BranchInspector;
