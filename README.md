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
    - cron: '0 0 * * *'  # Run every day at midnight

jobs:
  delete-old-actions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yanovation/delete-old-actions@v0.0.3-pre
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          days-ago: 30
```

# Release a new version
Check the current version:
```bash
git tag --list --sort=-v:refname | head -n 1
```

Create a tag and push it to the release branch:
```bash
# Update the version before running the command
RELEASE_VERSION="v1.0.0"
git tag "${RELEASE_VERSION}" -m "Minor release: ${RELEASE_VERSION}"
git push origin "${RELEASE_VERSION}"
```

Then move the major version tag (for example v1) to point to the Git ref of the current release:

```bash
git tag -fa v1 -m "Major release: v1"
git push origin v1 --force
```

Then remember to push to Github Marketplace by releasing manually from the GUI.
