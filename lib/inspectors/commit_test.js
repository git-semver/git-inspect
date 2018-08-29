const { expect }  = require('chai');
const sinon = require('sinon');
const CommitInspector = require('./commit');

describe('CommitInspector', () =>
{
  context('#dublicatedReduce', () =>
  {
    it('Should be aggregate dublicated commits', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { dublicated: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit1' },
        { id: 3, message: () => 'commit2' }
      ];
      commits.forEach(commit =>
      {
        acc = commitInspect.dublicatedReduce(commit, acc);
      });
      const { dublicated } = acc;
      expect(dublicated).to.deep.equal({
        [commits[0].message()]: [commits[0], commits[1]],
        [commits[2].message()]: [commits[2]],
      });
    });
  });
});
