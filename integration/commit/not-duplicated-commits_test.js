const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('Inspect commits without duplicated message', () =>
{
  const caseName = 'not-duplicated-commits';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be not include in report commits with duplicated message ', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(Object.keys(duplicatedMessage)).to.deep.equal([])
  });
});
