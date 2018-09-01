const messageRegex = /^([\s\S]{3,50})\n\n([\S\s]+)+$/; // if not exist then error

function shortMessageReducer(commit, statistic)
{
  const { shortMessage } = statistics;

  // Find commits with short message

  return { ...statistics, shortMessage };
}

module.exports = shortMessageReducer;
