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
  constructor(adapter)
  {
    this.adapter = adapter;
    this.report = getDefaultReport()
  }

  async report()
  {
    return { branches: [] };
  }
}

BranchInspector.getDefaultReport = getDefaultReport;

module.exports = BranchInspector;
