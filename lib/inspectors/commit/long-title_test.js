const { expect }  = require('chai');
const sinon = require('sinon');
const LongTitle = require('./long-title');

describe('Long title message commits reducer', () =>
{
  it('Should be not collect commit for short title', async () =>
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

  it('Should be not collect commit for empty title', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = '';
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([]);
  });

  it('Should be collect commit for long title', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = 'A'.repeat(51);
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([{ message }]);
  });

  it('Should be collect commit for real title', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = 'A'.repeat(51) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([{ message }]);
  });

  it('Should be collect commit for real title', async () =>
  {
    let acc = {};
    const reducer = new LongTitle();
    const longTitle = {};
    const message = 'A'.repeat(50) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, longTitle);
    const { commits } = result;
    expect(commits).to.deep.equal([]);
  });
});
