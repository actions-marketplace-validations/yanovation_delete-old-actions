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

# Usage

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

# Other docs
- [How to release](./_docs/release.md)
- [How to contribute](./CONTRIBUTING.md)
- [License](./LICENSE.md)
- [Change log](./CHANGELOG.md)