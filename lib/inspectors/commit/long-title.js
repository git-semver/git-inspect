const defaultOpts = {
  wrontTitleRegex: '/^.{51}/g' // if exist then error
};

class LongTitleReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, opts };
  }

  reduce(commit, longTitle)
  {
    // Find commits with long title in message

    return longTitle;
  }

  async afterReduce(longTitle)
  {
    return longTitle;
  }
}

LongTitleReducer.defaultOpts = defaultOpts;

module.exports = LongTitleReducer;
