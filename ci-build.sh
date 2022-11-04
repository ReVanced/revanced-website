#!/bin/bash

set -e

# CD to the directory of this script.
cd "$(dirname "$0")"

docs_git_repo="${REVANCED_DOCS_REPO:-https://github.com/revanced/revanced-documentation.git}"
export REVANCED_DOCS_FOLDER="_docs_src"

git clone "$docs_git_repo" "$REVANCED_DOCS_FOLDER"

# Do this because the docs repo doesn't have any actual docs right now
cd "$REVANCED_DOCS_FOLDER"
cp README.md index.md
cd -

# Copy assets from docs repo to here.
mkdir -p static/docs
cp -r "$REVANCED_DOCS_FOLDER"/assets static/docs/assets || true

npm run build
