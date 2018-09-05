const featureRegExp = /^feature\/.*$/;
const hotfixRegExp = /^hotfix\/.*$/;
const releaseRegExp = /^release\/.*$/;
const refPrefix = 'refs/heads/';

class GitFlowReducer
{
  constructor(adapter, opts)
  {
    this.opts = { ...defaultOpts, opts };
    this.adapter = adapter;
  }

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
    return branchNames.filter(name => featureRegExp.test(name))
  }

  findHotfixBranches(branchNames)
  {
    return branchNames.filter(name => hotfixRegExp.test(name))
  }

  findReleaseBranches(branchNames)
  {
    return branchNames.filter(name => releaseRegExp.test(name))
  }

  findOtherBranches(branchNames)
  {
    return branchNames.filter(name =>
      name !== 'master' &&
      name !== 'develop' &&
      !featureRegExp.test(name) &&
      !hotfixRegExp.test(name) &&
      !releaseRegExp.test(name));
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

  getBranchName(ref)
  {
    const refName = ref.name();
    return refName.replace(refPrefix, '');
  }

  async report(gitflow)
  {
    gitflow = {
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

    const branches = await this.adapter.getBranches();
    const branchNames = branches.map(ref => this.getBranchName(ref));

    gitflow.branches.master = this.checkMasterBranch(branchNames)
    gitflow.branches.develop = this.checkDevelopBranch(branchNames);
    gitflow.branches.features = this.findFeatureBranches(branchNames);
    gitflow.branches.hotfixes = this.findHotfixBranches(branchNames);
    gitflow.branches.releases = this.findReleaseBranches(branchNames);
    gitflow.branches.other = this.findOtherBranches(branchNames);

    return gitflow;
  }
}

GitFlowReducer.featureRegExp = featureRegExp;
GitFlowReducer.hotfixRegExp = hotfixRegExp;
GitFlowReducer.releaseRegExp = releaseRegExp;

module.exports = GitFlowReducer;
