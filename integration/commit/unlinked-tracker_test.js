const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect commits without issue tracker link', () =>
{
  const caseName = 'unlinked-tracker';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be supported by JSON Schema for this case', async () =>
  {
    const report = await inspector.collect();
    const result = report.getInstance();
    const validator = new SchemaValidator();
    const valid = validator.validate(result);
    expect(valid).to.equal(true, JSON.stringify(validator.errors));
  });

  it('Should be include in report commits without links', async () =>
  {
    const report = await inspector.collect();
    const { commit: { unlinkedTracker }} = report.getMappedResults();
    expect(unlinkedTracker.length).to.equal(3)
  });

  it('Should be include in report commits without links and with messages', async () =>
  {
    const report = await inspector.collect();
    const { commit: { unlinkedTracker }} = report.getMappedResults();
    expect(map(unlinkedTracker, 'message')).to.deep.equal([
      '3 unlinked',
      '4 unlinked',
      '2 unlinked',
    ]);
  });
});
