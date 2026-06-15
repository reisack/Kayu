---
name: kayu-planner
description: Plan and verify Kayu repository changes from a root SPECIFICATIONS.md file. Use when Codex must act as the planner agent in the Kayu planner-coder-tester workflow, produce the markdown implementation plan consumed by the coder and tester agents, or perform the final architecture and SOLID compliance review after implementation and tests.
---

# Kayu Planner

## Overview

Use this skill to convert `SPECIFICATIONS.md` into `.codex/plans/IMPLEMENTATION_PLAN.md`, then later verify the finished change against that plan, the Kayu architecture, and SOLID principles.

## Required Model

Run this custom agent with GPT 5.4.

## Planning Workflow

1. Read `SPECIFICATIONS.md` from the project root.
2. Read `AGENTS.md`, `docs/architecture.md`, `docs/coding-standards.md`, `docs/testing-guidelines.md`, and `docs/development-workflow.md`.
3. Inspect the existing files named or implied by the specification using `rg` and targeted file reads.
4. Produce `.codex/plans/IMPLEMENTATION_PLAN.md`.
5. Do not implement application code during planning unless the user explicitly asks to collapse roles.

## Plan Contract

Write the plan with these sections:

- `Specification Summary`: concise requested behavior and non-goals.
- `Architecture Fit`: affected layers, files, dependencies, and why they respect `src/pages`, `src/components`, `src/classes`, and `src/services` boundaries.
- `SOLID Review`: single responsibility, open/closed, Liskov, interface segregation, and dependency inversion notes that are relevant to the change.
- `Implementation Tasks`: ordered coder tasks with target files and acceptance criteria.
- `Testing Tasks`: ordered tester tasks with target test files, mocks, fixtures, and success/failure paths.
- `i18n And Constants`: translation keys, `Consts` usage, and API field selection decisions.
- `Validation Commands`: smallest useful commands first, then full done checks.
- `Planner Verification Checklist`: final checks the planner must run after implementation and tests.
- `Status`: `planned`, `implemented`, `tested`, or `verified`.

Keep tasks concrete enough that the coder can execute them without rereading the specification for intent. Call out any ambiguity as an explicit assumption.

## Kayu Architecture Rules

- Keep navigation-level behavior in `src/pages`.
- Keep reusable UI in `src/components`.
- Keep domain data in `src/classes`.
- Keep API, scoring, i18n initialization, and mapping logic in `src/services`.
- Prefer `@/` imports for application code.
- Put user-visible strings in `assets/i18n/fr.json`.
- Use `Consts` for shared API base URL, headers, colors, and scale factors.
- Avoid native Android or iOS edits unless the specification requires them.

## SOLID Guidance

- Single responsibility: each planned change should have one clear owner layer.
- Open/closed: prefer adding small helpers or service methods over modifying unrelated behaviors.
- Liskov substitution: keep shared domain shapes and component props compatible with existing callers.
- Interface segregation: define narrow API response and prop types; avoid broad catch-all objects.
- Dependency inversion: depend on existing service boundaries and constants rather than concrete duplicated URLs, headers, or calculations in UI code.

## Final Verification

After the coder and tester complete their work:

1. Read `.codex/plans/IMPLEMENTATION_PLAN.md`.
2. Inspect `git diff --stat` and the changed files.
3. Confirm implementation tasks and testing tasks are complete.
4. Confirm changed code respects folder boundaries, i18n, `Consts`, typed nullable API mapping, and SOLID notes.
5. Run or review the listed validation commands when feasible.
6. Update the plan `Status` to `verified` only when the change satisfies the checklist.
7. Report blockers as checklist items with exact files and reasons.

**Examples from other skills:**

- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py` - utilities for PDF manipulation
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Codex for patching or environment adjustments.

### references/

Documentation and reference material intended to be loaded into context to inform Codex's process and thinking.

**Examples from other skills:**

- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Codex should reference while working.

### assets/

Files not intended to be loaded into context, but rather used within the output Codex produces.

**Examples from other skills:**

- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Not every skill requires all three types of resources.**
