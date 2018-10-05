const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect commits without issue tracker link', () =>
{
  const caseName = 'unlinked-tracker';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be include in report commits without links', async () =>
  {
    const { commit: { unlinkedTracker }} = await inspector.report();
    expect(unlinkedTracker.commits.length).to.equal(3)
  });

  it('Should be include in report commits without links and with messages', async () =>
  {
    const { commit: { unlinkedTracker: { commits } }} = await inspector.report();
    expect(map(commits, 'message')).to.deep.equal([
      '3 unlinked',
      '4 unlinked',
      '2 unlinked',
    ]);
  });
});
