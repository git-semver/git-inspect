const { expect }  = require('chai');
const sinon = require('sinon');
const Branch = require('./branch');

describe('Branch', () =>
{
  context('#getBranchName', () =>
  {
    const repo = {};
    const branchInspector = new Branch(repo)
    const { refPrefix } = Branch;
    const repoStub = null;
    const developBranchName = 'develop';
    const developRefName = `${refPrefix}${developBranchName}`;
    const masterBranchName = 'master';
    const masterRefName = `${refPrefix}${masterBranchName}`;
    const releaseBranchName = 'release/v1.1.1'
    const releaseRefName = `${refPrefix}${releaseBranchName}`;
    const hotfixBranchName = 'hotfix/v1.1.1'
    const hotfixRefName = `${refPrefix}${hotfixBranchName}`;
    const featureBranchName = 'feature/feature-name'
    const featureRefName = `${refPrefix}${featureBranchName}`;
    const refs = {
      master: { name: () => masterRefName },
      develop: { name: () => developRefName },
      release: { name: () => releaseRefName },
      hotfix: { name: () => hotfixRefName },
      feature: { name: () => featureRefName }
    };

    it('Should be return develop branch name properly', () =>
      expect(branchInspector.getBranchName(refs.develop))
        .to.equal(developBranchName));

    it('Should be return master branch name properly', () =>
      expect(branchInspector.getBranchName(refs.master))
        .to.equal(masterBranchName));

    it('Should be return release branch name properly', () =>
      expect(branchInspector.getBranchName(refs.release))
        .to.equal(releaseBranchName));

    it('Should be return hotfix branch name properly', () =>
      expect(branchInspector.getBranchName(refs.hotfix))
        .to.equal(hotfixBranchName));

    it('Should be return feature branch name properly', () =>
      expect(branchInspector.getBranchName(refs.feature))
        .to.equal(featureBranchName));
  });
});
