const Repository = require('./repository');
const CommitsInspector = require('./inspectors/commits');

class Inspector
{
  constructor(directory)
  {
    this.directory = directory;
  }

  async report()
  {
    const report = {};
    const repo = new Repository(this.directory);
    await repo.init();
    const commitsInspector = new CommitsInspector(repo);
    report.commits = await commitsInspector.report();
    return report;
  }
}

module.exports = Inspector
