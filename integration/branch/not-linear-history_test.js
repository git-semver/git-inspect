const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const keyBy = require('lodash/keyBy');
const { inspect, clearGarden, SchemaValidator } = require('../helpers');

describe('[Integration] Inspect history is not linear', () =>
{
  const caseName = 'not-linear-history';
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

  it('Should be history is not linear', async () =>
  {
    const report = await inspector.collect();
    const { branch: { linear } } = report.getMappedResults();
    const { isLinearHistory, branches, linearFactor } = linear;
    const { master, topic1, topic2 } = keyBy(branches, 'name');
    expect(linearFactor).to.equal(0.816);
    expect(master.cousins.length).to.equal(3);
    expect(topic1.cousins.length).to.equal(0);
    expect(topic2.cousins.length).to.equal(2);
    expect(master.linearFactor).to.equal(0.7);
    expect(topic1.linearFactor).to.equal(1);
    expect(topic2.linearFactor).to.equal(0.75);
  });
});
