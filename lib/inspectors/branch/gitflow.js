const featureRegExp = /^feature\/.*$/;
const hotfixRegExp = /^hotfix\/.*$/;
const releaseRegExp = /^release\/.*$/;
const refPrefix = 'refs/heads/';

const defaultOpts = {};

class GitFlowReducer
{
  constructor(_, opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
  }

  checkMasterBranch(branchName)
  {
    return branchName == 'master';
  }

  checkDevelopBranch(branchName)
  {
    return branchName == 'develop';
  }

  checkFeatureBranche(branchName)
  {
    return featureRegExp.test(branchName)
  }

  checkHotfixBranche(branchName)
  {
    return hotfixRegExp.test(branchName)
  }

  checkReleaseBranche(branchName)
  {
    return releaseRegExp.test(branchName)
  }

  checkOtherBranche(branchName)
  {
    return branchName !== 'master' &&
      branchName !== 'develop' &&
      !featureRegExp.test(branchName) &&
      !hotfixRegExp.test(branchName) &&
      !releaseRegExp.test(branchName);
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
      ( features || hotfixes || releases ) &&
      !other;
  }

  async reduce(branch, gitflow)
  {
    if (!gitflow.branches)
    {
      gitflow.branches = {};
    }

    gitflow.branches.master = !gitflow.branches.master ? this.checkMasterBranch(branch.name) : gitflow.branches.master;
    gitflow.branches.develop = !gitflow.branches.develop ? this.checkDevelopBranch(branch.name) : gitflow.branches.develop;
    gitflow.branches.features = !gitflow.branches.features ? this.checkFeatureBranche(branch.name) : gitflow.branches.features;
    gitflow.branches.hotfixes = !gitflow.branches.hotfixes ? this.checkHotfixBranche(branch.name) : gitflow.branches.hotfixes;
    gitflow.branches.releases = !gitflow.branches.releases ? this.checkReleaseBranche(branch.name) : gitflow.branches.releases;
    gitflow.branches.other = !gitflow.branches.other ? this.checkOtherBranche(branch.name) : gitflow.branches.other;
    return gitflow;
  }

  async afterReduce(gitflow)
  {
    gitflow.scheme = this.checkSchemeSupport(gitflow);
    return gitflow;
  }
}

GitFlowReducer.featureRegExp = featureRegExp;
GitFlowReducer.hotfixRegExp = hotfixRegExp;
GitFlowReducer.releaseRegExp = releaseRegExp;

module.exports = GitFlowReducer;
