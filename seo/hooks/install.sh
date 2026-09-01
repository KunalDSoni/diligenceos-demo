#!/bin/sh
# Install the SEO pre-commit hook into this repository.
#
# Works from a worktree too: hooks live in the shared common git dir, so this
# installs the hook for the main checkout and every worktree at once.
set -e
hooks=$(git rev-parse --git-common-dir)/hooks
mkdir -p "$hooks"
if [ -f "$hooks/pre-commit" ] && ! grep -q 'DiligenceOS SEO pre-commit guard' "$hooks/pre-commit"; then
  cp "$hooks/pre-commit" "$hooks/pre-commit.backup.$(date +%Y%m%d%H%M%S)"
  echo "Existing hook backed up in $hooks"
fi
cp "$(git rev-parse --show-toplevel)/seo/hooks/pre-commit" "$hooks/pre-commit"
chmod +x "$hooks/pre-commit"
echo "Installed -> $hooks/pre-commit"
