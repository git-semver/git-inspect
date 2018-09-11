const { expect }  = require('chai');
const sinon = require('sinon');
const Commit = require('./commit');

describe('Commit entity', () =>
{
  it('Should be construct object', () =>
  {
    const message = 'message';
    const name = 'Name';
    const email = 'email@email.com';
    const sha = 'ShA256';
    const date = new Date();
    const commitObj = {
      message: () => `${message}${"\n"}`,
      sha: () => sha,
      date: () => date,
      author: () => ({
        name: () => name,
        email: () => email
      })
    };
    const commit = new Commit(commitObj);
    expect(commit.message).to.equal(message);
    expect(commit.author).to.equal(name);
    expect(commit.email).to.equal(email);
    expect(commit.sha).to.equal(sha);
    expect(commit.date.toDateString()).to.equal(date.toDateString());
  })
});
