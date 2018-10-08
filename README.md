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
    "total": <commits_total_count>,
    "duplicatedMessage": [
      [ "<commit_sha>" ]
    ],
    "unlinkedTracker": [ "<commit_sha>" ],
    "shortMessage": [ "<commit_sha>" ],
    "longTitle": [ "<commit_sha>" ],
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
        },
      }
      "linearFactor": <number>,
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
      "<branch_name>": "<head_commit>",
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
          "linearFactor": <number>
        }
      },
      "linearFactor": <number>
    },
    "obsolete": {
      "<branch_name>": "<head_commit>"
    }
  }
}
```
