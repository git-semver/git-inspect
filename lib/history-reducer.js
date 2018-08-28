const historyReducer = function(history, reduceCallback)
{
  const walkPromise = new Promise((resolve, reject) =>
  {
    let accumulator = null;

    history.on('commit', (commit) =>
    {
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

module.exports = historyReducer;
