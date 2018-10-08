const defaultOpts = {
  messageRegex: '^.{5,}\\n\\n.+' // if not exist then error
}

class ShortMessageReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
    this.regexp = new RegExp(this.opts.messageRegex);
  }

  reduce(commit, shortMessage)
  {
    if (!shortMessage)
    {
      shortMessage = [];
    }

    if (!this.regexp.test(commit.message))
    {
      shortMessage.push(commit);
    }

    return shortMessage;
  }

  async afterReduce(shortMessage)
  {
    return shortMessage;
  }
}

ShortMessageReducer.defaultOpts = defaultOpts;

module.exports = ShortMessageReducer;
