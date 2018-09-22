const { expect }  = require('chai');
const sinon = require('sinon');
const LongTitle = require('./long-title');

describe('Long title message commits reducer', () =>
{
  it('Should be not collect commit', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = 'A'.repeat(50);
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([]);
  });

  it('Should be collect commit', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = 'A'.repeat(52);
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([{ message }]);
  });
});
