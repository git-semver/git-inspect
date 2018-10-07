# git-inspect

Git repository inspector.

Inspect information about:

- Commits with duplicate message
- Commits with long title message (more than 50 symbols)
- Commits with short commit messages (without commit description)
- Commits that are not linked to issues
- Linearity of history
- Obsolete branches
- Supporting of GitFlow scheme

## Install

```
$ git clone git@bitbucket.org:realb0t/git-inspect.git
$ cd ./git-inspect
$ npm link
$ npm install -g
```

## Usage

Now use only in bare-repository directory

```
$ git clone <repository> --bare
$ cd ./<repository>
$ git-inspect
```

## Output


### Deprecated:
```
{
  "commit": {
    "duplicatedMessage": [
      [ "<commit_sha>" ]
    ],
    "unlinkedTracker": {
      "commits": [ '<commit_sha>' ]
    },
    "shortMessage": {
      "commits": [ '<commit_sha>' ]
    },
    "longTitle": {
      "commits": [ '<commit_sha>' ]
    }
  },
  "branch": {
    "gitflow": {
      "branches": {
       "master": <boolean>,
       "develop": <boolean>,
       "features": <boolean>,
       "hotfixes": <boolean>,
       "releases": <boolean>,
       "other": <boolean>
      },
      "scheme": <boolean>
    },
    "linear": {
      "branches": {
        "<branch_name>": {
          "cousins": [],
          "linearFactor": <number>,
          "isLinearHistory": <boolean>
        },
      }
      "linearFactor": <number>,
      "isLinearHistory": <boolean>
    },
    "obsolete": {
      "obsoleteBranches": {
        "<branch_name>": "<branch_ref>"
      },
      "branchesCount": <number>
    }
  }
}
```

### Perspective
```
{
  "commits": {
    "duplicatedMessage": [
      [ "<commit_sha>" ]
    ],
    "unlinkedTracker": [ "<commit_sha>" ],
    "shortMessage": [ "<commit_sha>" ],
    "longTitle": [ "<commit_sha>" ],
    "totalCommits": <number>,
    "contributors": { <email>: <name> }
  },
  "branches": {
    "heads": {
      "<branch_name>": "<commit_sha>",
    },
    "changes": "<heads_sha>",
    "gitflow": {
      "branches": {
       "master": <boolean>,
       "develop": <boolean>,
       "features": <boolean>,
       "hotfixes": <boolean>,
       "releases": <boolean>,
       "other": <boolean>
      },
      "scheme": <boolean>
    },
    "linear": {
      "branches": {
        "<branch_name>": {
          "cousins": [],
          "linearFactor": <number>,
          "isLinearHistory": <boolean>
        }
      },
      "linearFactor": <number>,
      "isLinearHistory": <boolean>
    },
    "obsolete": {
      "<branch_name>": "<branch_ref>"
    }
  }
}
```
