const { expect }  = require('chai');
const sinon = require('sinon');
const DublicateMessage = require('./duplicated-message');

describe('Duplicated message commits reducer', () =>
{
  it('Should be collect duplicated message commits if exist', async () =>
  {
    let acc = {};
    const dublicateMessage = new DublicateMessage({});
    const commits = [
      { id: 1, message: 'commit1' },
      { id: 2, message: 'commit1' },
      { id: 3, message: 'commit2' }
    ];

    const duplicatedMessageReport = [
      [commits[0], commits[1]]
    ];
    for (let i  in commits)
    {
      acc = await dublicateMessage.reduce(commits[i], acc);
    }
    acc = await dublicateMessage.afterReduce(acc);
    //delete acc.duplicatedConditates;
    expect(acc).to.deep.equal(duplicatedMessageReport);
  });

  it('Should be not collect duplicated message commits if not exist', async () =>
  {
    const dublicateMessage = new DublicateMessage({});
    let acc = {};
    const commits = [
      { id: 1, message: 'commit1' },
      { id: 2, message: 'commit2' },
      { id: 3, message: 'commit3' }
    ];

    const duplicatedMessageReport = [];

    for (let i  in commits)
    {
      acc = await dublicateMessage.reduce(commits[i], acc);
    }
    acc = await dublicateMessage.afterReduce(acc);
    expect(acc).to.deep.equal(duplicatedMessageReport);
  });
});
