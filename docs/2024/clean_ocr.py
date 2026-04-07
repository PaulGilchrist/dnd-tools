#!/usr/bin/env python3
import re
import os
from pathlib import Path

def clean_text(text):
    # Fix word breaks across lines
    lines = text.split('\n')
    cleaned_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.rstrip().endswith('-') and i + 1 < len(lines):
            next_line = lines[i + 1].lstrip()
            if next_line:
                line = line.rstrip('-') + next_line
                i += 1
        cleaned_lines.append(line)
        i += 1
    text = '\n'.join(cleaned_lines)
    
    # Fix common OCR errors
    text = re.sub(r'GHARACTER', 'CHARACTER', text)
    text = re.sub(r'GHARACTERS', 'CHARACTERS', text)
    text = re.sub(r'GHAPTER', 'CHAPTER', text)
    text = re.sub(r'GHAPTERS', 'CHAPTERS', text)
    text = re.sub(r'\d+\s+CHAPTER', 'CHAPTER', text)
    text = re.sub(r"PLAYER'S HANDBOOK", '', text)
    text = re.sub(r"DUNGEON MASTER'S GUIDE", '', text)
    text = re.sub(r'\s+-\s*\n', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+([.,;:!?])', r'\1', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
        cleaned = clean_text(original)
        if cleaned != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f'Fixed: {os.path.basename(filepath)}')
            return True
        return False
    except Exception as e:
        print(f'Error processing {filepath}: {e}')
        return False

def main():
    script_dir = Path(__file__).parent
    md_files = sorted(script_dir.glob('*.md'))
    print(f'Processing {len(md_files)} files...')
    fixed = 0
    for filepath in md_files:
        if process_file(filepath):
            fixed += 1
    print(f'\nCompleted: {fixed} files fixed')

if __name__ == '__main__':
    main()
