const defaultOpts = {
  wrontTitleRegex: '^.{51}' // if exist then error
};

class LongTitleReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
    this.regexp = new RegExp(this.opts.wrontTitleRegex);
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
    if (!longTitle)
    {
      longTitle = [];
    }

    if (this.regexp.test(commit.message))
    {
      longTitle.push(commit);
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
