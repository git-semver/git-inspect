const defaultOpts = {
  messageRegex: '/^.{5,}\\n\\n.+/g' // if not exist then error
}

class ShortMessageReducer
{
  constructor(opts = {})
  {
    this.opts = { ...defaultOpts, ...opts };
  }

  reduce(commit, shortMessage)
  {
    if (!shortMessage.commits)
    {
      shortMessage.commits = [];
    }

    const regexp = eval(this.opts.messageRegex);
    if (!regexp.test(commit.message))
    {
      shortMessage.commits.push(commit);
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
