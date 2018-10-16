const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect total commits', () =>
{
  const caseName = 'unlinked-tracker';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be supported by JSON Schema for this case', async () =>
  {
    const report = await inspector.collect();
    const validator = new SchemaValidator();
    const valid = validator.validate(report);
    expect(valid).to.equal(true, JSON.stringify(validator.errors));
  });

  it('Should be collect total commits count', async () =>
  {
    const { commit: { total }} = await inspector.collect();
    expect(total).to.equal(7);
  });
});
