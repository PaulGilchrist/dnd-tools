---
name: Bash Only macOS Safe
description: Forces Qwen to use ONLY macOS-safe bash commands for all file operations.
enabled: true
patterns:
  - "*"
---

# Injected into every prompt
- type: modifyModelPrompt
  match: ""
  replace: |
    You MUST follow these rules:

    1. Output ONLY macOS-safe bash commands.
    2. NEVER call Continue.dev tools.
    3. NEVER output JSON, objects, or parameters.
    4. NEVER output unified diffs.
    5. NEVER rewrite entire files unless explicitly asked.
    6. For sed in-place edits, ALWAYS use: sed -i '' 's/foo/bar/' file
    7. Do NOT use GNU-only commands or flags:
       - realpath
       - sha256sum (use shasum -a 256)
       - tac
       - rename
       - timeout
       - grep -P
       - sed -r
    8. The final output must be ONLY bash commands. No prose.

# Strip JSON/tool calls if the model tries anyway
- type: modifyModelResponse
  match: "{"
  replace: "# JSON removed by rule\n"

- type: modifyModelResponse
  match: "single_file_and_replace"
  replace: "# tool call removed by rule\n"

- type: modifyModelResponse
  match: "filepath"
  replace: "# filepath removed by rule\n"
