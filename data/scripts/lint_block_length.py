#!/usr/bin/env python3
"""Flag prayer blocks whose text is too long to fit on one screen in presentation mode.

Thresholds were derived from PresentationView's pagination math at a 1280x720
projector viewport with all four languages active and font multiplier 1.0:
- Soft (warn): 250 chars per language. Comfortably fits even at multiplier ~1.3.
- Hard (error): 400 chars per language. Beyond this, content gets cut off or
  paginated awkwardly. Split into multiple blocks at sentence/clause boundaries
  and suffix IDs (e.g. `ap-int-2a`, `ap-int-2b`).

Scans data/anaphoras/*.json plus data/kidan.json and data/serate-kidase.json.
Skips heading and rubric blocks. Exit code 1 if any errors found.

    python3 data/scripts/lint_block_length.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SOFT_LIMIT = 250
HARD_LIMIT = 400
LANGS = ("geez", "amharic", "english", "transliteration")
SKIP_TYPES = {"heading", "rubric"}


def lint_file(path: Path) -> tuple[list[str], list[str]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or "sections" not in data:
        return [], []
    sections = data.get("sections", [])
    warnings: list[str] = []
    errors: list[str] = []
    for section in sections:
        sid = section.get("id", "?")
        for block in section.get("blocks", []):
            if block.get("type") in SKIP_TYPES:
                continue
            bid = block.get("id", "?")
            for lang in LANGS:
                text = block.get(lang) or ""
                n = len(text)
                if n > HARD_LIMIT:
                    errors.append(
                        f"{path}:{sid}/{bid} {lang}={n} (>{HARD_LIMIT})"
                    )
                elif n > SOFT_LIMIT:
                    warnings.append(
                        f"{path}:{sid}/{bid} {lang}={n} (>{SOFT_LIMIT})"
                    )
    return warnings, errors


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    targets = sorted((repo_root / "data" / "anaphoras").glob("*.json"))
    targets += [
        repo_root / "data" / "kidan.json",
        repo_root / "data" / "serate-kidase.json",
    ]

    all_warnings: list[str] = []
    all_errors: list[str] = []
    for path in targets:
        if not path.exists() or "metadata" in path.name or "copy" in path.name:
            continue
        w, e = lint_file(path)
        all_warnings.extend(w)
        all_errors.extend(e)

    for line in all_warnings:
        print(f"WARN  {line}")
    for line in all_errors:
        print(f"ERROR {line}")

    print(
        f"\n{len(all_errors)} error(s), {len(all_warnings)} warning(s) "
        f"(soft={SOFT_LIMIT}, hard={HARD_LIMIT})"
    )
    return 1 if all_errors else 0


if __name__ == "__main__":
    sys.exit(main())
