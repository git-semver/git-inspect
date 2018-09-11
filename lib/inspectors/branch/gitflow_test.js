const { expect }  = require('chai');
const sinon = require('sinon');
const Gitflow = require('./gitflow');

describe.only('Gitflow branches reducer', () =>
{
  it('Should be return true for master branch', () =>
  {
    const reducer = new Gitflow({}, {});
    expect(reducer.checkMasterBranch('master')).to.equal(true);
  });

  it('Should be return true for develop branch', () =>
  {
    const reducer = new Gitflow({}, {});
    expect(reducer.checkDevelopBranch('develop')).to.equal(true);
  });

  it('Should be return true for feature branch', () =>
  {
    const reducer = new Gitflow({}, {});
    expect(reducer.checkFeatureBranche('feature/feature-name')).to.equal(true);
  });

  it('Should be return true for hotfix branch', () =>
  {
    const reducer = new Gitflow({}, {});
    expect(reducer.checkHotfixBranche('hotfix/hotfix-name')).to.equal(true);
  });

  it('Should be return true for release branch', () =>
  {
    const reducer = new Gitflow({}, {});
    expect(reducer.checkReleaseBranche('release/release-name')).to.equal(true);
  });

  it('Should be scheme support', async () =>
  {
    const branches = [
      { name: 'master' },
      { name: 'develop' },
      { name: 'feature/feature-name' },
      { name: 'hotfix/hotfix-name' },
      { name: 'release/release-name' }
    ];

    let gitflow = {};
    const reducer = new Gitflow({}, {});
    for (let branchIndex in branches)
    {
      gitflow = await reducer.reduce(branches[branchIndex], gitflow);
    }

    gitflow = await reducer.afterReduce(gitflow);
    expect(gitflow.scheme).to.equal(true);
  });

  it('Should be scheme not support if not exist master', async () =>
  {
    const branches = [
      { name: 'develop' },
      { name: 'feature/feature-name' },
      { name: 'hotfix/hotfix-name' },
      { name: 'release/release-name' }
    ];

    let gitflow = {};
    const reducer = new Gitflow({}, {});
    for (let branchIndex in branches)
    {
      gitflow = await reducer.reduce(branches, gitflow);
    }

    gitflow = await reducer.afterReduce(gitflow);
    expect(gitflow.scheme).to.equal(false);
  });

  it('Should be scheme not support if not exist develop', async () =>
  {
    const branches = [
      { name: 'master' },
      { name: 'feature/feature-name' },
      { name: 'hotfix/hotfix-name' },
      { name: 'release/release-name' }
    ];

    let gitflow = {};
    const reducer = new Gitflow({}, {});
    for (let branchIndex in branches)
    {
      gitflow = await reducer.reduce(branches, gitflow);
    }

    gitflow = await reducer.afterReduce(gitflow);
    expect(gitflow.scheme).to.equal(false);
  });

  it('Should be scheme not support if exist unsupported branch', async () =>
  {
    const branches = [
      { name: 'master' },
      { name: 'develop' },
      { name: 'feature/feature-name' },
      { name: 'hotfix/hotfix-name' },
      { name: 'release/release-name' },
      { name: 'other-branch-name' }
    ];

    let gitflow = {};
    const reducer = new Gitflow({}, {});
    for (let branchIndex in branches)
    {
      gitflow = await reducer.reduce(branches, gitflow);
    }

    gitflow = await reducer.afterReduce(gitflow);
    expect(gitflow.scheme).to.equal(false);
  });
});
