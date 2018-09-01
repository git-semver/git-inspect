const ticketRegex = /^(\w+-?\d+)\s/; // if not exist then error

function unlinkedTrackerReducer(commit, statistic)
{
  const { unlinkedTracker } = statistics;

  // Find unlinked issue tracker commits

  return { ...statistics, unlinkedTracker };
}

module.exports = unlinkedTrackerReducer;
