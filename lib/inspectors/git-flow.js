const BranchInspector = require('./branch');

const featureRegExp = /^feature\/.*$/;
const hotfixRegExp = /^hotfix\/.*$/;
const releaseRegExp = /^release\/.*$/;

class GitFlowInspector extends BranchInspector
{
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

    const klass = GitFlowInspector;
    const branches = await this.repo.branches();
    const branchNames = branches.map(ref => this.getBranchName(ref));

    report.branches.master = branchNames.includes('master');
    report.branches.develop = branchNames.includes('develop');
    report.branches.features = branchNames.filter(name => klass.featureRegExp.test(name));
    report.branches.hotfixes = branchNames.filter(name => klass.hotfixRegExp.test(name));
    report.branches.releases = branchNames.filter(name => klass.releaseRegExp.test(name));
    report.branches.other = branchNames.filter(name =>
      name !== 'master' &&
      name !== 'develop' &&
      !klass.featureRegExp.test(name) &&
      !klass.hotfixRegExp.test(name) &&
      !klass.releaseRegExp.test(name));
    report.supportScheme =
      report.branches.master &&
      report.branches.develop &&
      report.branches.features.length >= 0 &&
      report.branches.hotfixes.length >= 0 &&
      report.branches.releases.length >= 0 &&
      report.branches.other.length === 0;

    return report;
  }
}

GitFlowInspector.featureRegExp = featureRegExp;
GitFlowInspector.hotfixRegExp = hotfixRegExp;
GitFlowInspector.releaseRegExp = releaseRegExp;

module.exports = GitFlowInspector;
