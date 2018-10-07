const defaultOpts = {
  ticketRegex: '(\\w+-?\\d+)+' // if not exist then error
}

class UnlinkedTrackerReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
    this.regexp = new RegExp(this.opts.ticketRegex);
  }

  reduce(commit, unlinkedTracker)
  {
    if (!unlinkedTracker)
    {
      unlinkedTracker = [];
    }

    if (!this.regexp.test(commit.message))
    {
      unlinkedTracker.push(commit);
    }
    return unlinkedTracker;
  }

  async afterReduce(unlinkedTracker)
  {
    return unlinkedTracker;
  }
}

UnlinkedTrackerReducer.defaultOpts = defaultOpts;

module.exports = UnlinkedTrackerReducer;
