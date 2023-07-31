#!/bin/bash

set -e

# CD to the directory of this script.
cd "$(dirname "$0")"

docs_git_repo="${REVANCED_DOCS_REPO:-https://github.com/revanced/revanced-documentation.git}"

git clone "$docs_git_repo" "_docs_src"
# TODO: transform a tag links so this works properly...
#export REVANCED_DOCS_FOLDER="_docs_src/docs"

#git clone --recurse-submodules "$docs_git_repo" "_docs_src"

# Copy assets from docs repo to here.
# mkdir -p static/docs
# cp -r "$REVANCED_DOCS_FOLDER"/assets static/docs/assets || true

npm run build
