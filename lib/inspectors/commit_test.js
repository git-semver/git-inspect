const { expect }  = require('chai');
const sinon = require('sinon');
const CommitInspector = require('./commit');

describe('CommitInspector', () =>
{
  context('Dublicated commits', () =>
  {


    it('Should be collect dublicated commits if exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { dublicated: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit1' },
        { id: 3, message: () => 'commit2' }
      ];

      const dublicatedReport = {
        [commits[0].message()]: [commits[0], commits[1]]
      };

      commits.forEach(commit =>
      {
        acc = commitInspect.dublicatedReduce(commit, acc);
      });
      const { dublicated } = acc;
      expect(dublicated).to.deep.equal(dublicatedReport);
    });

    it('Should be not collect dublicated commits if not exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { dublicated: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit2' },
        { id: 3, message: () => 'commit3' }
      ];

      const dublicatedReport = {};

      commits.forEach(commit =>
      {
        acc = commitInspect.dublicatedReduce(commit, acc);
      });
      const { dublicated } = acc;
      expect(dublicated).to.deep.equal(dublicatedReport);
    });
  });
});
