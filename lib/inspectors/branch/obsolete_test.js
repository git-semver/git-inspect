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
});
