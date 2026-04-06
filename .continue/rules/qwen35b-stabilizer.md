---
name: Qwen35B Final Stabilizer
description: Prevents hidden reasoning stalls while allowing the model to operate normally. Soft constraints to avoid cold-start freezes.
priority: high
---

## modifyModelPrompt

You may think internally, but do not output any visible or hidden reasoning markers such as <think>, <analysis>, <reasoning>, <reflection>, or <scratchpad>.  
Begin your response with normal text, not with tag-like prefixes or control tokens.

## modifyModelResponse

If the response begins with any hidden reasoning token, tag-like prefix, partial tag, or non-text control token, strip it until the first normal text token appears.

Remove any visible or hidden occurrences of <think>, </think>, <analysis>, </analysis>, <reasoning>, </reasoning>, <reflection>, </reflection>, <scratchpad>, or </scratchpad>.

If the model emits any malformed or partial tag-like sequence, remove it completely.

Always return a clean, single assistant message with no reasoning markers.
