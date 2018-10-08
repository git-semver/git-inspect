const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect total commits', () =>
{
  const caseName = 'unlinked-tracker';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be collect total commits count', async () =>
  {
    const { commit: { total }} = await inspector.report();
    expect(total).to.equal(7);
  });
});
