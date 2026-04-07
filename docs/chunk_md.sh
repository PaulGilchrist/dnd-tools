#!/bin/bash

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo "Usage: ./chunk_md.sh input.md"
  exit 1
fi

BASENAME=$(basename "$INPUT" .md)

echo "=== Step 1: Run heading detector (input.md → cleaned.md) ==="

awk '
  # Detect ALL CAPS headings (2+ words)
  /^[A-Z0-9 ,.\x27-]+$/ && NF > 1 {
    line = tolower($0)
    sub(/^[ \t]+/, "", line)
    sub(/[ \t]+$/, "", line)
    split(line, words, " ")
    for (i in words) {
      words[i] = toupper(substr(words[i],1,1)) substr(words[i],2)
    }
    line = "# " words[1]
    for (i=2; i<=length(words); i++) line = line " " words[i]
    print line
    next
  }

  # Detect CHAPTER X style headings
  /^CHAPTER [0-9IVXLC]+/ {
    line = $0
    sub(/^[ \t]+/, "", line)
    print "# " line
    next
  }

  # Default: print line unchanged
  { print }
' "$INPUT" > "${BASENAME}_cleaned.md"

echo "Created: ${BASENAME}_cleaned.md"

echo "=== Step 2: Heading-aware chunking ==="

MAX_SIZE=40000
CHUNK_INDEX=1
CURRENT_FILE="${BASENAME}_$(printf "%03d" $CHUNK_INDEX).md"
CURRENT_SIZE=0

echo "Creating chunk: $CURRENT_FILE"
echo "" > "$CURRENT_FILE"

while IFS= read -r line; do
  if [[ "$line" =~ ^\# ]] && [ $CURRENT_SIZE -gt 0 ] && [ $CURRENT_SIZE -ge $MAX_SIZE ]; then
    CHUNK_INDEX=$((CHUNK_INDEX + 1))
    CURRENT_FILE="${BASENAME}_$(printf "%03d" $CHUNK_INDEX).md"
    echo "Creating chunk: $CURRENT_FILE"
    echo "" > "$CURRENT_FILE"
    CURRENT_SIZE=0
  fi

  echo "$line" >> "$CURRENT_FILE"
  CURRENT_SIZE=$((CURRENT_SIZE + ${#line} + 1))

done < "${BASENAME}_cleaned.md"

echo "=== Done! ==="
echo "Created chunk files:"
ls -1 ${BASENAME}_*.md
