function shortMessageReducer(commit, statistic)
{
  const { shortMessage } = statistics;

  // Find commits with short message

  return { ...statistics, shortMessage };
}

module.exports = shortMessageReducer;
