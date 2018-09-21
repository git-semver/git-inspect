const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('Inspect branches is not obsolete', () =>
{
  const caseName = 'not-obsolete-branch';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be not exist obsolete branches', async () =>
  {
    const { branch: { obsolete }} = await inspector.report();
    expect(Object.keys(obsolete.obsoleteBranches).length).to.equal(0);
    expect(obsolete.branchesCount).to.equal(2);
  });
});
