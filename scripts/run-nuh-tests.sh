#!/usr/bin/env bash
#
# run-nuh-tests.sh - Run NUH site Playwright tests filtered by tag,
#                    in headed (on-browser) or headless mode.
#
# Usage:
#   scripts/run-nuh-tests.sh -t <tag> [-m headed|headless] [-- <extra playwright args>]
#
# Examples:
#   scripts/run-nuh-tests.sh -t "@Regression"
#   scripts/run-nuh-tests.sh -t "@Login" -m headed
#   scripts/run-nuh-tests.sh -t "@Search|@Registration" -m headless
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG="playwright.sites.config.ts"
PROJECT="nuh"

TAG=""
MODE="headless"

print_usage() {
  cat <<EOF
Run NUH site Playwright tests filtered by @tag, in headed (on-browser) or headless mode.

Usage:
  $(basename "$0") -t <tag> [-m headed|headless] [-- <extra playwright args>]

Options:
  -t <tag>    Tag (grep pattern) to filter tests, e.g. "@Regression", "@Login", "@Search"
              Combine tags with "|" for OR, e.g. "@Login|@Search"
  -m <mode>   headed   = run visibly in a real browser window
              headless = run without a visible browser window (default)
  -h          Show this help message

Known tags in this suite (sites/nuh/tests/*.spec.js):
  Site:     @NUH
  Module:   @Module @Login @Registration @Search @SearchPage
  Behavior: @Navigation @Calculation @DataDriven @FormAction
  Path:     @HappyPath @NegativePath
  Suite:    @Regression

Examples:
  $(basename "$0") -t "@Regression"                    # headless (default)
  $(basename "$0") -t "@Login" -m headed                # visible browser
  $(basename "$0") -t "@Search|@Registration" -m headed
  $(basename "$0") -t "@NegativePath" -- --workers=1    # pass extra playwright flags
EOF
}

while getopts ":t:m:h" opt; do
  case $opt in
    t) TAG="$OPTARG" ;;
    m) MODE="$OPTARG" ;;
    h) print_usage; exit 0 ;;
    \?) echo "Unknown option: -$OPTARG" >&2; print_usage; exit 1 ;;
    :) echo "Option -$OPTARG requires an argument" >&2; print_usage; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

if [[ -z "$TAG" ]]; then
  echo "Error: a tag is required (-t)." >&2
  echo >&2
  print_usage
  exit 1
fi

case "$MODE" in
  headed)
    PW_FLAGS=(--headed)
    ;;
  headless)
    PW_FLAGS=()
    ;;
  *)
    echo "Error: -m must be 'headed' or 'headless' (got: $MODE)" >&2
    exit 1
    ;;
esac

cd "$ROOT_DIR"

echo "==> Site:    NUH"
echo "==> Tag:     $TAG"
echo "==> Mode:    $MODE"
echo "==> Config:  $CONFIG"
echo "==> Project: $PROJECT"
echo

if [[ ${#PW_FLAGS[@]} -gt 0 ]]; then
  npx playwright test --config="$CONFIG" --project="$PROJECT" --grep "$TAG" "${PW_FLAGS[@]}" "$@"
else
  npx playwright test --config="$CONFIG" --project="$PROJECT" --grep "$TAG" "$@"
fi
