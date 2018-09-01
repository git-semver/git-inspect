const wrontTitleRegex = /^.{51}/g; // if exist then error

function longTitleReducer(commit, statistic)
{
  const { longTitle } = statistics;

  // Find commits with long title in message

  return { ...statistics, longTitle };
}

module.exports = longTitleReducer;
