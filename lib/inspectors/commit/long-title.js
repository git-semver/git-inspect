function longTitleReducer(commit, statistic)
{
  const { longTitle } = statistics;

  // Find commits with long title in message

  return { ...statistics, longTitle };
}

module.exports = longTitleReducer;
