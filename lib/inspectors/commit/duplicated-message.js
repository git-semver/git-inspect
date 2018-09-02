class DublicatedMessageReducer
{
  reduce(commit, report)
  {
    const { duplicatedMessage } = report;
    let { duplicatedConditates } = report;

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

    return { ...report, duplicatedMessage, duplicatedConditates };
  }

  async afterReduce(report)
  {
    const clearReport = { ...report };
    delete clearReport.duplicatedConditates
    return clearReport;
  }
}

module.exports = DublicatedMessageReducer;
