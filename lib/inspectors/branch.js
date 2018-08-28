class BranchInspector
{
  constructor(repo)
  {
    this.repo = repo;
  }

  getBranchName(ref)
  {
    const refName = ref.name();
    return refName.replace(BranchInspector.refPrefix, '');
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

BranchInspector.refPrefix = 'refs/heads/';

module.exports = BranchInspector;
