const { expect }  = require('chai');
const sinon = require('sinon');
const CommitInspector = require('./commit');

describe('CommitInspector', () =>
{
  context('Duplicated commits', () =>
  {
    it('Should be collect duplicated commits if exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { duplicated: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit1' },
        { id: 3, message: () => 'commit2' }
      ];

      const duplicatedReport = {
        [commits[0].message()]: [commits[0], commits[1]]
      };

      commits.forEach(commit =>
      {
        acc = commitInspect.duplicatedReduce(commit, acc);
      });
      const { duplicated } = acc;
      expect(duplicated).to.deep.equal(duplicatedReport);
    });

    it('Should be not collect duplicated commits if not exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { duplicated: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit2' },
        { id: 3, message: () => 'commit3' }
      ];

      const duplicatedReport = {};

      commits.forEach(commit =>
      {
        acc = commitInspect.duplicatedReduce(commit, acc);
      });
      const { duplicated } = acc;
      expect(duplicated).to.deep.equal(duplicatedReport);
    });
  });
});
