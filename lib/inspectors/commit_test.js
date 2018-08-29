const { expect }  = require('chai');
const sinon = require('sinon');
const CommitInspector = require('./commit');

describe('CommitInspector', () =>
{
  context('Duplicated message commits', () =>
  {
    it('Should be collect duplicated message commits if exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { duplicatedMessage: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit1' },
        { id: 3, message: () => 'commit2' }
      ];

      const duplicatedMessageReport = {
        [commits[0].message()]: [commits[0], commits[1]]
      };

      commits.forEach(commit =>
      {
        acc = commitInspect.duplicatedMessageReduce(commit, acc);
      });
      const { duplicatedMessage } = acc;
      expect(duplicatedMessage).to.deep.equal(duplicatedMessageReport);
    });

    it('Should be not collect duplicated message commits if not exist', () =>
    {
      const commitInspect = new CommitInspector({});
      let acc = { duplicatedMessage: {} };
      const commits = [
        { id: 1, message: () => 'commit1' },
        { id: 2, message: () => 'commit2' },
        { id: 3, message: () => 'commit3' }
      ];

      const duplicatedMessageReport = {};

      commits.forEach(commit =>
      {
        acc = commitInspect.duplicatedMessageReduce(commit, acc);
      });
      const { duplicatedMessage } = acc;
      expect(duplicatedMessage).to.deep.equal(duplicatedMessageReport);
    });
  });
});
