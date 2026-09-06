#!/bin/sh
# Agent Ops 0.2.0 build + exposure gate (worker session could not execute this;
# run from repo root:  sh verify-build.sh)
set -e
cd "$(dirname "$0")"
echo "== tsc =="
npx tsc -p ./
echo "== vsce package =="
npx @vscode/vsce package --no-dependencies
echo "== vsix =="
ls -1 ./*.vsix
echo "== exposure grep (must be 0) =="
grep -rinE '192\.168|127\.0\.0\.1|localhost:|매출|한도|docker|:80[0-9][0-9]' src/ README.md package.json && { echo "EXPOSURE FOUND"; exit 1; } || echo "0 hits — clean"
echo "ALL GATES PASSED"
