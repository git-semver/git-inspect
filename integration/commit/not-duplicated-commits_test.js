const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect commits without duplicated message', () =>
{
  const caseName = 'not-duplicated-commits';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be supported by JSON Schema for this case', async () =>
  {
    const report = await inspector.report();
    const validator = new SchemaValidator();
    const valid = validator.validate(report);
    expect(valid).to.equal(true, JSON.stringify(validator.errors));
  });

  it('Should be not include in report commits with duplicated message ', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(duplicatedMessage).to.deep.equal([])
  });
});
