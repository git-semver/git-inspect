const ticketRegex = /^(\w+-?\d+)\s/; // if not exist then error

function unlinkedTrackerReducer(commit, report)
{
  const { unlinkedTracker } = report;

  // Find unlinked issue tracker commits

  return { ...report, unlinkedTracker };
}

module.exports = unlinkedTrackerReducer;
