# git-inspect

Git repository inspector.

Used agreements from the following links to form inspection requirements:

- [Git style guide](https://github.com/agis/git-style-guide)
- [Distributed Git - Contributing to a Project](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [Git Guidelines](https://github.com/monterail/guidelines/blob/master/git.md)

The inspector collects information about:

- Commits with duplicated message
- Commits with long title message (more than 50 symbols in first commit message row)
- Commits with short commit messages (without commit description rows)
- Commits that are not linked to issues
- Linearity of history
- Obsolete branches
- Supporting of GitFlow scheme

Supported functionality

- Inspection of local bare repository

## Install

From repository
```
$ git clone git@bitbucket.org:realb0t/git-inspect.git
$ cd ./git-inspect
$ npm link
$ npm install -g
```

From NPM-registry
```
$ npm install git-inspect -g
```

## Usage

In the working tree repository the inspector collects incomplete information.
Now use only in bare repository directory.

```
$ git clone <repository> --bare
$ cd ./<repository>
```

### Use as CLI

Run in repository directory:
```
$ git-inspect
```

Run somewhere
```
$ git-inspect path-to-bare-repository
```

### Use as API

```javascript
const { Inspector, Repository, schema, version } = require('git-inspect');

const cwd = process.cwd();
const repository = new Repository(cwd);
const inspector = new Inspector(repository);
const report = async inspector.collect();
```

## Output

Report output is available in two formats:

- As JS object for use Inspector API
- As JSON for use CLI (by [GitInspect report JSON Schema](report-schema.json))

Example JSON output:

```
$ git-inspect
```

Result:
```
{
  "config": {},
  "repository": {
    "remote": [
      {
        "name": "origin",
        "url": "git@github.com/user/example.git"
      }
    ],
    "directoryPath": "path/to/repository"
  },
  "results": [
    {
      "inspector": "commit",
      "reducer": "duplicatedMessage",
      "report": [
        ["4a41b496fe20a5fbea5e155999c79523536116ca"]
      ],
    },
    {
      "inspector": "commit",
      "reducer": "unlinkedTracker",
      "report": ["4a41b496fe20a5fbea5e155999c79523536116ca"],
    },
    {
      "inspector": "commit",
      "reducer": "longTitle",
      "report": ["4a41b496fe20a5fbea5e155999c79523536116ca"],
    },
    {
      "inspector": "commit",
      "reducer": "shortMessage",
      "report": ["4a41b496fe20a5fbea5e155999c79523536116ca"],
    },
    {
      "inspector": "branch",
      "reducer": "gitflow",
      "report": {
          "master": true,
          "develop": true,
          "features": true,
          "hotfixes": true,
          "releases": true,
          "other": true
        },
        "scheme": true
      },
    },
    {
      "inspector": "branch",
      "reducer": "linear",
      "report": {
        "branches": [{
          "name": "master",
          "cousins": [],
          "linearFactor": 1
        }],
        "linearFactor": 1  
      },
    },
    {
      "inspector": "branch",
      "reducer": "obsolete",
      "report": {
        "branches": [{
          "name": "feature/obsolete-feature-branch"
         }]
      },
    }
  ],
  "startTimestamp": '0000-00-00T00:00:00',
  "endTimestamp": '0000-00-00T00:00:00',
  "time": 0
}
```

# Tests

Coverage includes integration tests and unit tests.

For run all tests, execute:
```
$ npm test
```

To run only unit tests, execute:
```
$ npm run test:unit
```

Unit tests are located next to the code. And have file mask `*_test.js`.

To run only integration tests, execute:
```
$ npm run test:integration
```

Integration tests are located in directory `./integration`. And have file mask `*_test.js`.


# Build with

- [NodeGit](https://www.nodegit.org/) - Use for work with git repository

# Feedback

- [Gitter](https://gitter.im/GitSemver/git-inspect)
- [Issues](https://github.com/git-semver/git-inspect/issues)

# TODO

See [TODO LIST](TODO.md)

# Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see [the tags](https://github.com/git-semver/git-inspect/tags) on this repository.

# License

This project is licensed under the GNU AGPLv3 License - see the [LICENSE](LICENSE) file for details.
