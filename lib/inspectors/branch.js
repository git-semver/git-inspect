class BranchInspector
{
  constructor(repo)
  {
    this.repo = repo;
  }

  getBranchName(ref)
  {
    const refName = ref.name();
    return refName.replace('refs/heads/', '');
  }

  async report()
  {
    const report = { branches: [] };
    const branches = await this.repo.branches();
    branches.forEach(branch => report.branches.push(this.getBranchName(branch)));
    return report;
  }
}

module.exports = BranchInspector;
