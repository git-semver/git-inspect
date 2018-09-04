const refPrefix = 'refs/heads/';

const reducerNames = {
  gitflow: 'gitflow',
  linear: 'linear',
  unmerged: 'unmerged'
};

const getDefaultReport = () => ({
  [reducerNames.gitflow]: Object.create(null),
  [reducerNames.linear]: Object.create(null),
  [reducerNames.unmerged]: [],
  [reducerNames.longTitle]: [],
});

class BranchInspector
{
  constructor(adapter)
  {
    this.adapter = adapter;
    this.report = getDefaultReport()
  }

  getBranchName(ref)
  {
    const refName = ref.name();
    return refName.replace(refPrefix, '');
  }

  async report()
  {
    const report = { branches: [] };
    const branches = await this.repo.getBranches();
    const branchNames = branches.map(ref => this.getBranchName(ref));
    report.branches = branchNames;
    return report;
  }
}

BranchInspector.refPrefix = refPrefix;

module.exports = BranchInspector;
