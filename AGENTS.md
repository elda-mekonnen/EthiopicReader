# Skills

Shared instructions for AI coding agents (Claude Code, Codex, OpenCode, etc.).
Uses the [Agent Skills](https://agentskills.io) format. All skills are local in `skills/`.

## Project-Specific Skills

- [anaphora-parser](skills/anaphora-parser/SKILL.md) — Parse Ethiopian Orthodox anaphoras from PDF into structured JSON for the Qidase Reader

## Block length

Each language field on a prayer block (`geez`, `amharic`, `english`, `transliteration`) should be **≤ 250 characters** so it renders on one screen in presentation mode at default font size. **Hard limit: 400 characters.** When source text is longer (Lord's Prayer, Creed, long intercessions), split it into multiple blocks at sentence/clause boundaries — suffix IDs (`ap-int-2a`, `ap-int-2b`, …) and keep `speaker` and `type` consistent across the parts.

Run after edits:

```bash
python3 data/scripts/lint_block_length.py
```

Exit code 1 if any block exceeds the hard limit.

## Frontend Design

- [frontend-design](skills/frontend-design/SKILL.md) — Distinctive, production-grade frontend interfaces that avoid generic AI aesthetics

## Expo Skills (from [expo/skills](https://github.com/expo/skills))

- [building-native-ui](skills/building-native-ui/SKILL.md) — Building beautiful apps with Expo Router, styling, components, navigation, animations
- [native-data-fetching](skills/native-data-fetching/SKILL.md) — Network requests, API calls, caching, offline support
- [expo-api-routes](skills/expo-api-routes/SKILL.md) — API routes in Expo Router with EAS Hosting
- [expo-dev-client](skills/expo-dev-client/SKILL.md) — Build and distribute Expo development clients
- [expo-tailwind-setup](skills/expo-tailwind-setup/SKILL.md) — Tailwind CSS v4 with NativeWind v5 for Expo
- [use-dom](skills/use-dom/SKILL.md) — DOM components to run web code in native webviews
- [expo-deployment](skills/expo-deployment/SKILL.md) — Deploying to App Store, Play Store, web, and API routes
- [expo-cicd-workflows](skills/expo-cicd-workflows/SKILL.md) — EAS workflow YAML for CI/CD pipelines
- [upgrading-expo](skills/upgrading-expo/SKILL.md) — Upgrading Expo SDK versions and fixing dependency issues
