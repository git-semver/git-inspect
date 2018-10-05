const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect commits with duplicated message', () =>
{
  const caseName = 'duplicated-commits';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be include in report commits with duplicated message ', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(Object.keys(duplicatedMessage)).to.deep.equal(['1', '4', '5'])
  });

  it('Should be include in report duplicated commits messages', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(map(duplicatedMessage['1'], 'message')).to.deep.equal(['1', '1']);
    expect(map(duplicatedMessage['4'], 'message')).to.deep.equal(['4', '4', '4']);
    expect(map(duplicatedMessage['5'], 'message')).to.deep.equal(['5', '5']);
  });
});
