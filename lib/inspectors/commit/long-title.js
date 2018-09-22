const defaultOpts = {
  wrontTitleRegex: '/^.{51}/g' // if exist then error
};

class LongTitleReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, opts };
  }

  /**
   * Callback for reduce commits with long title
   *
   * Find commits with long title in message
   *
   * @param {Commit} commit - Commit for reduce
   * @param {Object} longTitle - Reduced state
   */
  reduce(commit, longTitle)
  {
    if (!longTitle.commits)
    {
      longTitle.commits = [];
    }

    const regexp = eval(this.opts.wrontTitleRegex);
    if (regexp.test(commit.message))
    {
      longTitle.commits.push(commit);
    }

    return longTitle;
  }

  async afterReduce(longTitle)
  {
    return longTitle;
  }
}

LongTitleReducer.defaultOpts = defaultOpts;

module.exports = LongTitleReducer;
