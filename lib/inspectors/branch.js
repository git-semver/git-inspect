const GitflowReducer = require('./branch/gitflow');
const LinearReducer = require('./branch/linear');
const ObsoleteReducer = require('./branch/obsolete');
const Branch = require('../adapters/nodegit/branch');

const reducerNames = {
  gitflow: 'gitflow',
  linear: 'linear',
  obsolete: 'obsolete'
};

const getDefaultReport = () => ({
  [reducerNames.gitflow]: Object.create(null),
  [reducerNames.linear]: Object.create(null),
  [reducerNames.obsolete]: Object.create(null)
});

class BranchInspector
{
  constructor(adapter, opts = {})
  {
    this.adapter = adapter;
    this.opts = opts;
    this.report = getDefaultReport();
    this.reducers = {
      [reducerNames.gitflow]: new GitflowReducer(this.adapter, this.opts[reducerNames.gitflow]),
      [reducerNames.linear]: new LinearReducer(this.adapter, this.opts[reducerNames.linear]),
      [reducerNames.obsolete]: new ObsoleteReducer(this.adapter, this.opts[reducerNames.obsolete])
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
        this.report[reducerName] = await reducer.reduce(branch, this.report[reducerName], branches);
      }
    }

    for (let reducerName in this.reducers)
    {
      const reducer = this.reducers[reducerName];
      this.report[reducerName] = await reducer.afterReduce(this.report[reducerName]);
    }

    return this.report;
  }
}

BranchInspector.getDefaultReport = getDefaultReport;
BranchInspector.reducerNames = reducerNames;

module.exports = BranchInspector;
