<div align="center">

[![License](https://img.shields.io/github/license/yanovation/delete-old-actions?color=blue&label=License&style=flat-square)](https://github.com/yanovation/delete-old-actions/blob/main/LICENSE.md)
[![Last commit](https://img.shields.io/github/last-commit/yanovation/delete-old-actions.svg?color=blue&style=flat-square)](https://github.com/yanovation/delete-old-actions/commits/main)
[![Contributors](https://img.shields.io/github/contributors/yanovation/delete-old-actions?color=blue&style=flat-square)](https://github.com/yanovation/delete-old-actions/graphs/contributors)
</div>

# About

Removes old GitHub Actions runs to keep your repository clean.
You are advised to run this action with the dry-run option first to see what will be deleted.  
When you are ready to use this, you can schedule it to check periodically.

**WARNING: Deletion cannot be undone. Use at your own risk.**

## Usage

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Specify your own schedule

jobs:
  delete-old-actions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yanovation/delete-old-actions@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          days-ago: 30
```

Or you can test with dry-run option:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  delete-old-actions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yanovation/delete-old-actions@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          days-ago: 30
          dry-run: true 
```

## Options

* `token`: The GitHub token to use for authentication. (**required**)
* `days-ago`: The number of days ago to delete the runs. (**required**)
* `dry-run`: If set to true, the Action will only list the runs to be deleted without actually deleting them. (**optional**,
  default: false)
* `keep-latest`: The number of latest runs to keep. (**optional**, default: 0)

For the token, you can just use the `{{ secrets.GITHUB_TOKEN }}` which is a default secret that GitHub provides to each
run. You can read more about
it [here](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).


## Other docs

- [How to release](./_docs/release.md)
- [How to contribute](./CONTRIBUTING.md)
- [License](./LICENSE.md)
- [Change log](./CHANGELOG.md)

## Articles (to learn more about it)
- [Automatically delete old GitHub Actions runs](https://pooyan.info/articles/delete-old-github-actions-runs)
