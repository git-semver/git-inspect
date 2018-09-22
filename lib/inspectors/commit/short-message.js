const defaultOpts = {
  messageRegex: '/^([\s\S]{3,50})\n\n([\S\s]+)+$/' // if not exist then error
}

class ShortMessageReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, opts };
  }

  reduce(commit, shortMessage)
  {
    return shortMessage;
  }

  async afterReduce(shortMessage)
  {
    return shortMessage;
  }
}

ShortMessageReducer.defaultOpts = defaultOpts;

module.exports = ShortMessageReducer;
