const BranchInspector = require('./branch');

const featureRegExp = /^feature\/.*$/;
const hotfixRegExp = /^hotfix\/.*$/;
const releaseRegExp = /^release\/.*$/;

class GitFlowInspector extends BranchInspector
{
  checkMasterBranch(branchNames)
  {
    return branchNames.includes('master');
  }

  checkDevelopBranch(branchNames)
  {
    return branchNames.includes('develop')
  }

  findFeatureBranches(branchNames)
  {
    return branchNames.filter(name => GitFlowInspector.featureRegExp.test(name))
  }

  findHotfixBranches(branchNames)
  {
    return branchNames.filter(name => GitFlowInspector.hotfixRegExp.test(name))
  }

  findReleaseBranches(branchNames)
  {
    return branchNames.filter(name => GitFlowInspector.releaseRegExp.test(name))
  }

  findOtherBranches(branchNames)
  {
    return branchNames.filter(name =>
      name !== 'master' &&
      name !== 'develop' &&
      !GitFlowInspector.featureRegExp.test(name) &&
      !GitFlowInspector.hotfixRegExp.test(name) &&
      !GitFlowInspector.releaseRegExp.test(name));
  }

  checkSchemeSupport({
    branches: {
      master,
      develop,
      features,
      hotfixes,
      releases,
      other
    }
  })
  {
    return master &&
      develop &&
      features.length >= 0 &&
      hotfixes.length >= 0 &&
      releases.length >= 0 &&
      other.length === 0;
  }

  async report()
  {
    const report = {
      supportScheme: false,
      branches: {
        master: false,
        develop: false,
        features: [],
        hotfixes: [],
        releases: [],
        other: []
      }
    };

    const branches = await this.repo.getBranches();
    const branchNames = branches.map(ref => this.getBranchName(ref));

    report.branches.master = this.checkMasterBranch(branchNames)
    report.branches.develop = this.checkDevelopBranch(branchNames);
    report.branches.features = this.findFeatureBranches(branchNames);
    report.branches.hotfixes = this.findHotfixBranches(branchNames);
    report.branches.releases = this.findReleaseBranches(branchNames);
    report.branches.other = this.findOtherBranches(branchNames);
    report.supportScheme = this.checkSchemeSupport(report);

    return report;
  }
}

GitFlowInspector.featureRegExp = featureRegExp;
GitFlowInspector.hotfixRegExp = hotfixRegExp;
GitFlowInspector.releaseRegExp = releaseRegExp;

module.exports = GitFlowInspector;
