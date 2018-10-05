const { expect }  = require('chai');
const sinon = require('sinon');
const UnlinkedTracker = require('./unlinked-tracker');

describe('Short message commits reducer', () =>
{
  it('Should be not collect commit with ticket link', async () =>
  {
    let acc = {};
    const reducer = new UnlinkedTracker();
    const shortMessage = {};
    const message = 'WA-000 Commit description';
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([]);
  });

  it('Should be collect commit without ticket link', async () =>
  {
    let acc = {};
    const reducer = new UnlinkedTracker();
    const shortMessage = {};
    const message = 'Commit description';
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([commit]);
  });
});
