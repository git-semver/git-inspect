const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('[Integration] Inspect history is not linear', () =>
{
  const caseName = 'not-linear-history';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it('Should be history is not linear', async () =>
  {
    const { branch: { linear }} = await inspector.report();
    const { isLinearHistory, branches, linearFactor } = linear;
    const { master, topic1, topic2 } = branches;
    expect(isLinearHistory).to.equal(false);
    expect(linearFactor).to.equal(0.816);
    expect(master.isLinearHistory).to.equal(false);
    expect(topic1.isLinearHistory).to.equal(true);
    expect(topic2.isLinearHistory).to.equal(false);
    expect(master.cousins.length).to.equal(3);
    expect(topic1.cousins.length).to.equal(0);
    expect(topic2.cousins.length).to.equal(2);
    expect(master.linearFactor).to.equal(0.7);
    expect(topic1.linearFactor).to.equal(1);
    expect(topic2.linearFactor).to.equal(0.75);
  });
});
