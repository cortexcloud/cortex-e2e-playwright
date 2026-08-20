#!/usr/bin/env bash
# PreToolUse hook (Bash matcher): blocks `git add .` / `git add *` wildcard staging.
# Per AGENTS.md #9 - stage files explicitly by name or directory, never with a wildcard.
set -euo pipefail

cmd="$(jq -r '.tool_input.command // empty')"

if echo "$cmd" | grep -qE '(^|[;&|]|&&)[[:space:]]*git add[[:space:]]+(\.|\*)[[:space:]]*($|[;&|])'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked: wildcard git add (\".\" or \"*\") is forbidden by AGENTS.md #9 - stage files explicitly by name or directory instead, e.g. git add sites/nuh/tests/foo.spec.js"
    }
  }'
else
  echo '{}'
fi
