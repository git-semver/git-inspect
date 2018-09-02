const ticketRegex = /^(\w+-?\d+)\s/; // if not exist then error

class UnlinkedTrackerReducer
{
  reduce(commit, report)
  {
    const { unlinkedTracker } = report;

    // Find unlinked issue tracker commits

    return { ...report, unlinkedTracker };
  }

  async afterReduce(report)
  {
    return report;
  }
}

UnlinkedTrackerReducer.ticketRegex = ticketRegex;

module.exports = UnlinkedTrackerReducer;
