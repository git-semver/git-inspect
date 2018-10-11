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
const report = async inspector.report();
```

## Output

Report output is available in two formats:

- As JS object for use Inspector API
- As JSON for use CLI (by [GitInspect report JSON Schema](report-schema.json))

Example JSON output:

```
$ git-inspect
...
{
  "commit": {
    "total": 1,
    "duplicatedMessage": [
      ["4a41b496fe20a5fbea5e155999c79523536116ca"]
    ],
    "unlinkedTracker": ["4a41b496fe20a5fbea5e155999c79523536116ca"],
    "shortMessage": ["4a41b496fe20a5fbea5e155999c79523536116ca"],
    "longTitle": ["4a41b496fe20a5fbea5e155999c79523536116ca"]
  },
  "branch": {
    "gitflow": {
    "branches": {
      "master": true,
      "develop": true,
      "features": true,
      "hotfixes": true,
      "releases": true,
      "other": true
    },
    "scheme": true
  },
  "linear": {
    "branches": [{
      "name": "master",
      "cousins": [],
      "linearFactor": 1
    }],
    "linearFactor": 1
  },
  "obsolete": {
    "branches": [{
      "name": "feature/obsolete-feature-branch"
     }]
    }
  }
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
