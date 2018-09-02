const messageRegex = /^([\s\S]{3,50})\n\n([\S\s]+)+$/; // if not exist then error

function shortMessageReducer(commit, report)
{
  const { shortMessage } = report;

  // Find commits with short message

  return { ...report, shortMessage };
}

module.exports = shortMessageReducer;
