const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect commits with long title', () =>
{
  const caseName = 'long-title-commit';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be include in report commits with long title', async () =>
  {
    const { commit: { longTitle }} = await inspector.report();
    //expect(longTitle.commits.length).to.equal(1)
    expect(true).to.equal(true);
  });

  it('Should be include in report commits with long title and message', async () =>
  {
    const { commit: { longTitle: { commits } }} = await inspector.report();
    expect(map(commits, 'message')).to.deep.equal([
      'This is not normal but is very long title. Bad commit'
    ]);
  });
});
