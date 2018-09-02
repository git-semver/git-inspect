const wrontTitleRegex = /^.{51}/g; // if exist then error

function longTitleReducer(commit, report)
{
  const { longTitle } = report;

  // Find commits with long title in message

  return { ...report, longTitle };
}

module.exports = longTitleReducer;
