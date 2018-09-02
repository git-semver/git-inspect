const wrontTitleRegex = /^.{51}/g; // if exist then error

class LongTitleReducer
{
  reduce(commit, report)
  {
    const { longTitle } = report;

    // Find commits with long title in message

    return { ...report, longTitle };
  }

  async afterReduce(report)
  {
    return report;
  }
}

LongTitleReducer.wrontTitleRegex = wrontTitleRegex;

module.exports = LongTitleReducer;
