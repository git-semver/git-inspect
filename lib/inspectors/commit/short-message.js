const messageRegex = /^([\s\S]{3,50})\n\n([\S\s]+)+$/; // if not exist then error

class ShortMessageReducer
{
  reduce(commit, report)
  {
    const { shortMessage } = report;

    // Find commits with short message

    return { ...report, shortMessage };
  }

  async afterReduce(report)
  {
    return report;
  }
}

ShortMessageReducer.messageRegex = messageRegex;

module.exports = ShortMessageReducer;
