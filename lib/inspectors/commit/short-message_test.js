const { expect }  = require('chai');
const sinon = require('sinon');
const ShortMessage = require('./short-message');

describe('Short message commits reducer', () =>
{
  it('Should be not collect commit success case', async () =>
  {
    let acc = {};
    const reducer = new ShortMessage();
    const shortMessage = {};
    const message = 'A'.repeat(5) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([]);
  });

  it('Should be collect commit message with short title', async () =>
  {
    let acc = {};
    const reducer = new ShortMessage();
    const shortMessage = {};
    const message = 'A'.repeat(4) + "\n\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([commit]);
  });

  it('Should be collect commit message without description', async () =>
  {
    let acc = {};
    const reducer = new ShortMessage();
    const shortMessage = {};
    const message = 'A'.repeat(5);
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([commit]);
  });

  it('Should be collect commit message with invalid format', async () =>
  {
    let acc = {};
    const reducer = new ShortMessage();
    const shortMessage = {};
    const message = 'A'.repeat(5) + "\nCommit description";
    const commit = { message };
    const result = await reducer.reduce(commit, shortMessage);
    const { commits } = result;
    expect(commits).to.deep.equal([commit]);
  });
});
