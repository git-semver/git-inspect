const { expect }  = require('chai');
const sinon = require('sinon');
const ShortMessage = require('./total');

describe('Total commits reducer', () =>
{
  it('Should be not collect single commit', async () =>
  {
    const reducer = new ShortMessage();
    const shortMessage = null;
    const sha = 'SHA';
    const commit = { sha };
    const result = await reducer.reduce(commit, shortMessage);
    const final = await reducer.afterReduce(result);
    expect(result).to.deep.equal({ [sha]: true });
    expect(final).to.equal(1);
  });

  it('Should be not collect two different commit', async () =>
  {
    const reducer = new ShortMessage();
    const shortMessage = null;
    const sha1 = 'SHA1';
    const sha2 = 'SHA2';
    const commit1 = { sha: sha1 };
    const commit2 = { sha: sha2 };
    const result = await reducer.reduce(commit1, shortMessage);
    const lastResult = await reducer.reduce(commit2, result);
    const final = await reducer.afterReduce(lastResult);
    expect(lastResult).to.deep.equal({ [sha1]: true, [sha2]: true });
    expect(final).to.equal(2);
  });

  it('Should be not collect two same commit', async () =>
  {
    const reducer = new ShortMessage();
    const shortMessage = null;
    const sha1 = 'SHA1';
    const sha2 = sha1;
    const commit1 = { sha: sha1 };
    const commit2 = { sha: sha2 };
    const result = await reducer.reduce(commit1, shortMessage);
    const lastResult = await reducer.reduce(commit2, result);
    const final = await reducer.afterReduce(lastResult);
    expect(lastResult).to.deep.equal({ [sha1]: true });
    expect(final).to.equal(1);
  });
});
