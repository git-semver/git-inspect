const defaultOpts = {
  ticketRegex: '/^(\\w+-?\\d+)+\\s.+/' // if not exist then error
}

class UnlinkedTrackerReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
  }

  reduce(commit, unlinkedTracker)
  {
    if (!unlinkedTracker.commits)
    {
      unlinkedTracker.commits = [];
    }

    const regexp = eval(this.opts.ticketRegex);
    if (!regexp.test(commit.message))
    {
      unlinkedTracker.commits.push(commit);
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
