const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect commits with duplicated message', () =>
{
  const caseName = 'duplicated-commits';
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

  it('Should be include in report commits with duplicated message ', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(duplicatedMessage.length).to.equal(3)
  });

  it('Should be include in report duplicated commits messages', async () =>
  {
    const { commit: { duplicatedMessage }} = await inspector.report();
    expect(map(duplicatedMessage[0], 'message')).to.deep.equal(['1', '1']);
    expect(map(duplicatedMessage[1], 'message')).to.deep.equal(['4', '4', '4']);
    expect(map(duplicatedMessage[2], 'message')).to.deep.equal(['5', '5']);
  });
});
