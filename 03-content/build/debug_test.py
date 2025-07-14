#!/usr/bin/env python3
import re
from pathlib import Path

# Read the Armenian genocide file
armenian_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/case-studies/armenian-genocide.md")
with open(armenian_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("=== CHECKING FOR SECTION HEADERS ===")
lines = content.split('\n')
for i, line in enumerate(lines[:20]):
    if line.startswith('##'):
        print(f"Line {i+1}: {line}")

# Test regex matching on original content
vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', content, re.DOTALL)
if vignette_match:
    print("\n=== VIGNETTE MATCH FOUND ===")
    vignette_text = vignette_match.group(1).strip()
    print(f"Length: {len(vignette_text)}")
    print("First 200 chars:", vignette_text[:200])
else:
    print("\n=== NO VIGNETTE MATCH ===")

# Test analysis match
analysis_match = re.search(r'## B\. Historical Context(.*?)$', content, re.DOTALL)
if analysis_match:
    print("\n=== ANALYSIS MATCH FOUND ===")
    analysis_text = analysis_match.group(1).strip()
    print(f"Length: {len(analysis_text)}")
    print("First 200 chars:", analysis_text[:200])
else:
    print("\n=== NO ANALYSIS MATCH ===")
