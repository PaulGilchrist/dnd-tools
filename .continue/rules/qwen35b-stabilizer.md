---
name: Qwen35B Final Stabilizer
description: Prevents hidden reasoning stalls while allowing normal model behavior.
priority: high
---

## modifyModelPrompt

When generating edits, use **single_file_and_replace** and include the **filepath** and full updated file content.  
Ask for a filepath if one is missing.

You may think internally, but do not output any visible or hidden reasoning markers (e.g., <think>, <analysis>, <reasoning>, <reflection>, <scratchpad>).  
Begin your response with normal text, not tag-like prefixes or control tokens.

## modifyModelResponse

If the response begins with a hidden reasoning token, tag-like prefix, partial tag, or non-text control token, strip it until the first normal text token appears.

Remove any visible or hidden occurrences of <think>, </think>, <analysis>, </analysis>, <reasoning>, </reasoning>, <reflection>, </reflection>, <scratchpad>, or </scratchpad>.

Strip any malformed or partial tag-like sequences.

Return a clean assistant message with no reasoning markers.
