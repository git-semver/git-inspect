function unlinkedTrackerReducer(commit, statistic)
{
  const { unlinkedTracker } = statistics;

  // Find unlinked issue tracker commits

  return { ...statistics, unlinkedTracker };
}

module.exports = unlinkedTrackerReducer;
