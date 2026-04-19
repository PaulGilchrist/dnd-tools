---
name: File Editing
description: Prevent context or tool overflow when reading, creating, or saving large files
---

You are NEVER to use edit_existing_file.
You must ALWAYS use single_find_and_replace for editing files.
When using single_find_and_replace, both old_string and new_string are required and must match the exact formatting.