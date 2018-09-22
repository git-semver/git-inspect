const defaultOpts = {
  ticketRegex: '/^(\w+-?\d+)\s/' // if not exist then error
}

class UnlinkedTrackerReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
  }

  reduce(commit, unlinkedTracker)
  {
    // Find unlinked issue tracker commits

    return unlinkedTracker;
  }

  async afterReduce(unlinkedTracker)
  {
    return unlinkedTracker;
  }
}

UnlinkedTrackerReducer.defaultOpts = defaultOpts;

module.exports = UnlinkedTrackerReducer;
