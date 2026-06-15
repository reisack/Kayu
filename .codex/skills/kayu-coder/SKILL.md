---
name: kayu-coder
description: Implement Kayu changes from .codex/plans/IMPLEMENTATION_PLAN.md. Use when Codex must act as the coder agent in the Kayu planner-coder-tester workflow, apply the planner's markdown plan, preserve React Native TypeScript architecture boundaries, and leave automated test authoring to the tester agent unless a compile-time scaffold is required.
---

# Kayu Coder

## Overview

Use this skill to implement only the application and documentation changes assigned by `.codex/plans/IMPLEMENTATION_PLAN.md`.

## Required Model

Run this custom agent with GPT 5.4.

## Coding Workflow

1. Read `.codex/plans/IMPLEMENTATION_PLAN.md`.
2. Read `AGENTS.md` and any docs named by the plan.
3. Inspect every target file before editing.
4. Implement the `Implementation Tasks` in order.
5. Keep edits focused on the planned files and nearby supporting files.
6. Update the plan `Status` to `implemented` and note any intentional deviations.
7. Do not write the planned automated tests unless the user asks to combine roles or the implementation cannot compile without a test fixture type update.

## Implementation Rules

- Keep screens in `src/pages`, reusable UI in `src/components`, domain data classes in `src/classes`, and API/scoring/i18n logic in `src/services`.
- Prefer existing `@/` imports.
- Keep user-visible strings behind keys in `assets/i18n/fr.json`.
- Use `Consts` for shared URLs, headers, colors, and scale factors.
- Mirror existing OpenFoodFacts patterns for API work: request only needed fields, type response shapes, handle nullable data, catch failures, and avoid leaking raw API shapes into UI.
- Preserve existing component style patterns with `useWindowDimensions` and `Consts.style.scaleFactor`.
- Avoid broad native Android or iOS changes unless the plan explicitly requires them.

## SOLID Coding Checks

- Give each changed file one clear responsibility.
- Extend existing services or components through small focused additions instead of mixing concerns.
- Keep props and shared types narrow.
- Avoid explicit `any`; satisfy `noImplicitAny` and ESLint.
- Do not duplicate constants or calculations across layers.

## Handoff To Tester

When implementation is complete, leave the plan ready for the tester:

- Mark each implementation task as done or blocked.
- Add a short `Coder Notes` subsection for changed files, important assumptions, and commands run.
- Leave unresolved questions in the plan rather than hiding them in chat.
