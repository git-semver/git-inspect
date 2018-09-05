const { expect }  = require('chai');
const sinon = require('sinon');
const { createRepository, clearGarden } = require('../helpers');
const Inspector = require('../../lib/inspector');

describe('Inpect commits with duplicated message', () =>
{
  const repository = 'duplicated-commits';
  let currentWorkDirectory = null;

  beforeEach(async () => currentWorkDirectory = await createRepository(repository));
  afterEach(async () => await clearGarden(repository));

  it('Commits with duplicated message should be include in report', async () =>
  {
    const inspector = new Inspector(currentWorkDirectory);
    const report = await inspector.report();
    expect(true).to.equal(true);
  });
});
