const EventEmitter = require('events');
const { expect }  = require('chai');
const sinon = require('sinon');
const historyReducer = require('./history-reducer');

describe('History reducer', () =>
{
  it('Should be concat commits', done =>
  {
    const { concatReducer } = historyReducer;
    const commits = [{ name: 'commit1' }, { name: 'commit2' }];
    class FakeHistory extends EventEmitter
    {
      start()
      {
        commits.forEach(commit => this.emit('commit', commit));
        this.emit('end');
      }
    }

    const fakeHistory = new FakeHistory();
    concatReducer(fakeHistory).then(result =>
    {
      expect(result).to.deep.equal(commits);
      done();
    });
  });

  it('Should be raise error', done =>
  {
    const { concatReducer } = historyReducer;
    class FakeHistory extends EventEmitter
    {
      start() {}
    }

    const fakeHistory = new FakeHistory();
    const error = new Error('error');
    concatReducer(fakeHistory).catch((err, acc) =>
    {
      expect(err).to.equal(error);
      done();
    });

    fakeHistory.emit('error', error);
  });
});
