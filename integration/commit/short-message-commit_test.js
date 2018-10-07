const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect commits with short message', () =>
{
  const caseName = 'short-message-commit';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be include in report commits with short message', async () =>
  {
    const { commit: { shortMessage }} = await inspector.report();
    expect(shortMessage.length).to.equal(1)
  });

  it('Should be include in report commits with short message and with message', async () =>
  {
    const { commit: { shortMessage }} = await inspector.report();
    expect(map(shortMessage, 'message')).to.deep.equal([
      'Short message commit'
    ]);
  });
});
