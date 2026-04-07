#!/bin/bash

# Directory containing your chunked Markdown files
CHUNK_DIR="2024"
SCHEMA_PATH="../src/data/2024/magic-items.schema.json"
OUTPUT="../public/data/2024/magic-items.json"

# LM Studio API endpoint
API_URL="http://localhost:1234/v1/chat/completions"

# Initialize output file
echo "[]" > "$OUTPUT"

echo "Starting extraction..."
echo "Writing results to: $OUTPUT"

for FILE in "$CHUNK_DIR"/*.md; do
  echo "Processing: $FILE"

  CONTENT=$(cat "$FILE" | sed 's/"/\\"/g')

  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"qwen\",
      \"messages\": [
        {
          \"role\": \"system\",
          \"content\": \"You extract magic items. You MUST follow the JSON schema exactly. Output ONLY valid JSON objects.\"
        },
        {
          \"role\": \"user\",
          \"content\": \"Here is a chunk of rules text. Extract all magic items and output ONLY JSON objects that match the schema at $SCHEMA_PATH. If none exist, output an empty array.\\n\\n$CONTENT\"
        }
      ],
      \"temperature\": 0
    }")

  # Extract JSON from the model response
  JSON=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' | jq '.' 2>/dev/null)

  if [ -z "$JSON" ] || [ "$JSON" == "null" ]; then
    echo "No JSON found in response."
    continue
  fi

  # Merge into master file
  jq -s '.[0] + .[1]' "$OUTPUT" <(echo "$JSON") > tmp.json && mv tmp.json "$OUTPUT"

done

echo "Extraction complete."
echo "Final JSON written to: $OUTPUT"
