const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect branches is obsolete', () =>
{
  const caseName = 'obsolete-branch';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be exist one obsolete branch', async () =>
  {
    const { branch: { obsolete }} = await inspector.report();
    expect(Object.keys(obsolete.obsoleteBranches)).to.deep.equal(['obsolete-branch']);
    expect(obsolete.branchesCount).to.equal(2);
  });
});
