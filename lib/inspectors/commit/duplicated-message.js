const defaultOpts = {};

class DublicatedMessageReducer
{
  constructor(opts)
  {
    this.opts = { ...defaultOpts, opts };
  }

  reduce(commit, duplicatedMessage)
  {
    let { duplicatedConditates } = duplicatedMessage;

    if (!duplicatedConditates)
    {
      duplicatedConditates = Object(null);
    }

    const message = commit.message;

    if (duplicatedMessage[message])
    {
      duplicatedMessage[message] = [...duplicatedMessage[message], commit];
    }
    else if (duplicatedConditates[message])
    {
      duplicatedMessage[message] = [...duplicatedConditates[message], commit];
      delete duplicatedConditates[message];
    }
    else
    {
      duplicatedConditates[message] = [commit];
      duplicatedMessage.duplicatedConditates = duplicatedConditates;
    }

    return duplicatedMessage;
  }

  afterReduce(duplicatedMessage)
  {
    delete duplicatedMessage.duplicatedConditates
    return duplicatedMessage;
  }
}

DublicatedMessageReducer.defaultOpts = defaultOpts;

module.exports = DublicatedMessageReducer;
