const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect commits with long title', () =>
{
  const caseName = 'long-title-commit';
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

  it('Should be include in report commits with long title', async () =>
  {
    const report = await inspector.collect();
    const { commit: { longTitle }} = report.getMappedResults();
    expect(longTitle.length).to.equal(1);
  });

  it('Should be include in report commits with long title and message', async () =>
  {
    const report = await inspector.collect();
    const { commit: { longTitle }} = report.getMappedResults();
    expect(map(longTitle, 'message')).to.deep.equal([
      'This is not normal but is very long title. Bad commit'
    ]);
  });
});
