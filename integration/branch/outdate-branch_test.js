const { expect }  = require('chai');
const sinon = require('sinon');
const map = require('lodash/map');
const { inspect, clearGarden } = require('../helpers');

describe('Inspect branches as outdated', () =>
{
  const caseName = 'outdate-branch';
  let inspector = null;

  beforeEach(async () => { inspector = await inspect(caseName); });
  afterEach(async () => await clearGarden(caseName));

  it.only('Should be ...', async () =>
  {
    const { branch: { unmerged }} = await inspector.report();
  });
});
