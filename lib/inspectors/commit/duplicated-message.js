function duplicatedMessage(commit, statistic)
{
  const { duplicatedMessage } = statistics;
  let { duplicatedConditates } = statistics;

  if (!duplicatedConditates)
  {
    duplicatedConditates = Object(null);
  }

  const message = commit.message();

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
  }

  return { ...statistics, duplicatedMessage, duplicatedConditates };
}

module.exports = duplicatedMessage;
