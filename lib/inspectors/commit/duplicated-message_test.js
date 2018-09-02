const { expect }  = require('chai');
const sinon = require('sinon');
const DublicateMessage = require('./commit/duplicated-message');

describe('Duplicated message commits reducer', () =>
{
  it('Should be collect duplicated message commits if exist', () =>
  {
    let acc = {};
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
      acc = duplicatedMessageReduce(commit, acc);
    });
    expect(acc).to.deep.equal(duplicatedMessageReport);
  });

  it('Should be not collect duplicated message commits if not exist', () =>
  {
    const dublicateMessage = new DublicateMessage({});
    let acc = {};
    const commits = [
      { id: 1, message: () => 'commit1' },
      { id: 2, message: () => 'commit2' },
      { id: 3, message: () => 'commit3' }
    ];

    const duplicatedMessageReport = {};

    commits.forEach(commit =>
    {
      acc = dublicateMessage.reduce(commit, acc);
    });
    expect(acc).to.deep.equal(duplicatedMessageReport);
  });
});
