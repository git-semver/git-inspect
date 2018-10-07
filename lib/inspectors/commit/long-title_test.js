const { expect }  = require('chai');
const sinon = require('sinon');
const LongTitle = require('./long-title');

describe('Long title message commits reducer', () =>
{
  it('Should be not collect commit for short title', async () =>
  {
    const reducer = new LongTitle();
    const longTitle = [];
    const message = 'A'.repeat(50);
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    expect(result).to.deep.equal([]);
  });

  it('Should be not collect commit for empty title', async () =>
  {
    const reducer = new LongTitle();
    const longTitle = [];
    const message = '';
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    expect(result).to.deep.equal([]);
  });

  it('Should be collect commit for long title', async () =>
  {
    const reducer = new LongTitle();
    const longTitle = [];
    const message = 'A'.repeat(51);
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    expect(result).to.deep.equal([{ message }]);
  });

  it('Should be collect commit for real title', async () =>
  {
    const reducer = new LongTitle();
    const longTitle = [];
    const message = 'A'.repeat(51) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    expect(result).to.deep.equal([{ message }]);
  });

  it('Should be collect commit for real title', async () =>
  {
    const reducer = new LongTitle();
    const longTitle = [];
    const message = 'A'.repeat(50) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    expect(result).to.deep.equal([]);
  });
});
