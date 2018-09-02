const refPrefix = 'refs/heads/';

class BranchInspector
{
  constructor(repo)
  {
    this.repo = repo;
    this.report
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
