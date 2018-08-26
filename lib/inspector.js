const Repository = require('./repository');

class Inspector
{
  constructor(directory)
  {
    this.directory = directory;
  }

  async inspect()
  {
    const inspector = new Repository(this.directory);
    await inspector.init();
    const commits = await inspector.commits();
    commits.forEach((commit) =>
    {
      console.log("commit " + commit.sha());
      console.log("Author:", commit.author().name() +
      " <" + commit.author().email() + ">");
      console.log("Date:", commit.date());
      console.log("\n    " + commit.message());
    });
  }
}

module.exports = Inspector
