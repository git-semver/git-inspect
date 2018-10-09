# git-inspect

Git repository inspector.

The inspector collects information about:

- Commits with duplicate message
- Commits with long title message (more than 50 symbols in first commit message row)
- Commits with short commit messages (without commit description rows)
- Commits that are not linked to issues
- Linearity of history
- Obsolete branches
- Supporting of GitFlow scheme

## Install

From repository
```
$ git clone git@bitbucket.org:realb0t/git-inspect.git
$ cd ./git-inspect
$ npm link
$ npm install -g
```

From registry
```
$ npm install git-inspect -g
```

## Usage

Now use only in bare repository directory

```
$ git clone <repository> --bare
$ cd ./<repository>
```

### Use as CLI

```
$ git-inspect
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

- As JSON if use CLI (by [GitInspect report JSON Schema](report-schema.json))
- As JS object if use Inspector API

Example JSON output:

```json
{
	"commit": {
		"total": 1,
		"duplicatedMessage": [
			["<commit_sha>"]
		],
		"unlinkedTracker": ["<commit_sha>"],
		"shortMessage": ["<commit_sha>"],
		"longTitle": ["<commit_sha>"]
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
				"name": "<branch_name>",
				"cousins": [],
				"linearFactor": 1
			}],
			"linearFactor": 1
		},
		"obsolete": {
			"branches": [{
				"name": "<branch_name>"
			}]
		}
	}
}
```
