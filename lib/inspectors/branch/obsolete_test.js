const { expect }  = require('chai');
const sinon = require('sinon');
const ObsoleteReducer = require('./obsolete');

describe('Obsolete branches reducer', () =>
{
  it('Should be ignore trunk branche for check obsolete', async () =>
  {
    const trunkBranchName = 'trunk';
    const branches = [];
    const branch = { name: trunkBranchName }
    const obsolete = {};
    const adapter = { isObsoleteBranch: async () => obsolete };
    const opts = { trunkBranches: [trunkBranchName] };
    const reducer = new ObsoleteReducer(adapter, opts);

    const result = await reducer.isObsolete(branch, branches);
    expect(result).to.equal(false);
  });

  it('Should be not ignore not trunk branche for check obsolete', async () =>
  {
    const trunkBranchName = 'trunk';
    const branches = [];
    const branch = { name: 'notTrunk' };
    const obsolete = {};
    const adapter = { isObsoleteBranch: async () => obsolete };
    const opts = { trunkBranches: [trunkBranchName] };
    const reducer = new ObsoleteReducer(adapter, opts);

    const result = await reducer.isObsolete(branch, branches);
    expect(result).to.equal(obsolete);
  });

  it('Should be return upstream branches with trunk branches', async () =>
  {
    const trunkBrancheNames = [ 'develop', 'master' ];
    const notTrunkBranch = { name: 'notTrunk' };
    const primaryTrunkBranch = { name: 'master' };
    const secondaryTrunkBranch = { name: 'develop' };
    const branches = [notTrunkBranch, primaryTrunkBranch, secondaryTrunkBranch];
    const adapter = {};
    const opts = { trunkBranches: trunkBrancheNames };
    const reducer = new ObsoleteReducer(adapter, opts);

    const result = await reducer.getUpstreamBranches(branches);
    expect(result).to.deep.equal([primaryTrunkBranch, secondaryTrunkBranch]);
  });

  it('Should be return upstream branches without trunk branches', async () =>
  {
    const trunkBrancheNames = undefined;
    const notTrunkBranch = { name: 'notTrunk' };
    const primaryTrunkBranch = { name: 'master' };
    const secondaryTrunkBranch = { name: 'develop' };
    const branches = [notTrunkBranch, primaryTrunkBranch, secondaryTrunkBranch];
    const adapter = {};
    const opts = { trunkBranches: trunkBrancheNames };
    const reducer = new ObsoleteReducer(adapter, opts);

    const result = await reducer.getUpstreamBranches(branches);
    expect(result).to.deep.equal(branches);
  });
});
