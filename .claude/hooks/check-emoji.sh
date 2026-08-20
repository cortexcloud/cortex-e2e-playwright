#!/usr/bin/env bash
# PreToolUse hook (Write|Edit matcher): blocks file content containing emoji.
# Per AGENTS.md #6 - no emoji in source code, comments, or docs. Use NOTE:/WARNING: instead.
set -euo pipefail

content="$(jq -r '.tool_input.content // .tool_input.new_string // empty')"

has_emoji="$(node -e '
const data = require("fs").readFileSync(0, "utf8");
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
process.stdout.write(emojiRegex.test(data) ? "yes" : "no");
' <<< "$content")"

if [ "$has_emoji" = "yes" ]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked: emoji detected in file content. AGENTS.md #6 forbids emoji in source code/comments/docs - use plain NOTE:/WARNING: prefixes instead."
    }
  }'
else
  echo '{}'
fi
