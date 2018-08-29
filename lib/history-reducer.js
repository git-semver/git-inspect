const historyReducer = function(history, reduceCallback, initState = null)
{
  const walkPromise = new Promise((resolve, reject) =>
  {
    let accumulator = initState;

    history.on('commit', (commit) =>
    {
      // TODO: make async reducer
      accumulator = reduceCallback(commit, accumulator);
    });

    history.on('end', () => resolve(accumulator));
    history.on('error', error => reject(error));
  });
  history.start();

  return walkPromise;
}

historyReducer.concatReducer = (commit, commits) =>
{
  if (commits === null) { commits = []; }
  commits = [ ...commits, commit ];
  return commits;
};

historyReducer.concatReducer = (history) =>
  historyReducer(history, (commit, commits) =>
    [ ...commits, commit ], []);


module.exports = historyReducer;
