#!/bin/bash

PDF="$1"

if [ -z "$PDF" ]; then
  echo "Usage: ./pdf_to_md.sh input.pdf"
  exit 1
fi

BASENAME=$(basename "$PDF" .pdf)

echo "Converting PDF pages to PNG..."
pdftoppm "$PDF" "$BASENAME" -png

echo "Running OCR on each page..."
for img in ${BASENAME}-*.png; do
  echo "OCR: $img"
  tesseract "$img" "$img" -l eng
done

echo "Combining OCR text..."
cat ${BASENAME}-*.txt > "${BASENAME}.txt"

echo "Converting to Markdown..."
pandoc "${BASENAME}.txt" -t markdown -o "${BASENAME}.md"

echo "Done!"
echo "Output: ${BASENAME}.md"
