const { expect }  = require('chai');
const sinon = require('sinon');
const Branch = require('./branch');

describe('Branch entity', () =>
{
  it('Should be construct object', () =>
  {
    const branchName = 'master';
    const refName = `${Branch.refPrefix}${branchName}`;
    const ref = { name: () => refName, isHead: () => true };
    const branch = new Branch(ref);
    expect(branch.name).to.equal(branchName);
    expect(branch.ref).to.equal(refName);
    expect(branch.isHead).to.equal(true);
    expect(branch.source).to.equal(ref);
  })
});
