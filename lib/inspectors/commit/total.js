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
   * Callback for reduce commits for total
   *
   *
   * @param {Commit} commit - Commit for reduce
   * @param {Object} longTitle - Reduced state
   */
  reduce(commit, total)
  {
    if (!total)
    {
      total = {};
    }

    total[commit.sha] = true;

    return total;
  }

  async afterReduce(total)
  {
    return Object.keys(total).length;
  }
}

LongTitleReducer.defaultOpts = defaultOpts;

module.exports = LongTitleReducer;
