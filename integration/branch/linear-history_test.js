const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const keyBy = require('lodash/keyBy');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect history is linear', () =>
{
  const caseName = 'linear-history';
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

  it('Should be history is linear', async () =>
  {
    const { branch: { linear }} = await inspector.report();
    const { branches, linearFactor } = linear;
    const { master, topic1, topic2, topic3 } = keyBy(branches, 'name');
    expect(linearFactor).to.equal(1);
    expect(master.cousins.length).to.equal(0);
    expect(topic1.cousins.length).to.equal(0);
    expect(topic2.cousins.length).to.equal(0);
    expect(topic3.cousins.length).to.equal(0);
    expect(master.linearFactor).to.equal(1);
    expect(topic1.linearFactor).to.equal(1);
    expect(topic2.linearFactor).to.equal(1);
    expect(topic3.linearFactor).to.equal(1);
  });
});
