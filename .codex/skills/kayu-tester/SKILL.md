---
name: kayu-tester
description: Write and run focused automated tests for Kayu changes from .codex/plans/IMPLEMENTATION_PLAN.md. Use when Codex must act as the tester agent in the Kayu planner-coder-tester workflow, add Jest or React Native Testing Library coverage near changed services, components, or pages, and report validation results back into the markdown plan.
---

# Kayu Tester

## Overview

Use this skill to add focused automated tests after the coder implements the markdown plan.

## Required Model

Run this custom agent with GPT 5.4.

## Testing Workflow

1. Read `.codex/plans/IMPLEMENTATION_PLAN.md`.
2. Read `AGENTS.md`, `docs/testing-guidelines.md`, and any test files named by the plan.
3. Inspect the implementation diff and nearest existing tests.
4. Implement the `Testing Tasks` in order.
5. Run the narrowest useful test command first, then broader validation when feasible.
6. Update the plan `Status` to `tested` and add `Tester Notes` with commands, results, and any residual risk.

## Test Placement

- Service behavior belongs under `__tests__/services`.
- Reusable UI behavior belongs under `__tests__/components`.
- Navigation-level behavior belongs under `__tests__/pages`.
- API fixtures belong under `__tests__/services/mocks`.
- Test file names should follow the source file name plus `-tests`.

## Coverage Expectations

- Cover success and failure paths for API behavior.
- Cover null and missing OpenFoodFacts fields when response mapping changes.
- Cover score math, sorting, filtering, and clamping in service tests.
- Cover rendered text, loading states, `testID` elements, callbacks, and navigation in component or page tests.
- Prefer direct assertions over snapshots unless the existing nearby test already uses snapshots for the same behavior.

## Mocking Rules

- Use `jest-fetch-mock` for fetches.
- Reset shared mocks in `beforeEach` when tests mutate them.
- Mock React Native or native-only modules locally when the test cannot run in Jest.
- Mock `react-i18next` so `t(key)` returns `key` when asserting translation keys.
- Mock `useWindowDimensions` for stable width and font scale in UI tests.

## Validation Commands

Use the commands already defined by `package.json`:

- `npm test` for Jest.
- `npm run test:cov` for coverage.
- `npm run lint` for lint validation.
- `npm run prettier` to format changed files when needed.

When a full command is too costly or unavailable, record the exact reason in `Tester Notes`.
