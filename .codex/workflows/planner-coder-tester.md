# Kayu Planner-Coder-Tester Workflow

Use this workflow when a change should move through explicit planning, implementation, automated testing, and final architectural verification.

## Inputs

- `SPECIFICATIONS.md`: the root feature or fix specification.
- `AGENTS.md`: repository-wide agent rules.
- `docs/architecture.md`, `docs/coding-standards.md`, `docs/testing-guidelines.md`, and `docs/development-workflow.md`: required project context.

## Outputs

- `.codex/plans/IMPLEMENTATION_PLAN.md`: the handoff document shared by all agents.
- Source, test, i18n, and documentation edits required by the plan.

## Agent Sequence

1. Planner agent: use `$kayu-planner`.

   - Read `SPECIFICATIONS.md` and required docs.
   - Inspect relevant source and tests.
   - Write `.codex/plans/IMPLEMENTATION_PLAN.md`.
   - Confirm the plan respects Kayu architecture and SOLID principles.

2. Coder agent: use `$kayu-coder`.

   - Read the markdown plan.
   - Implement only the planned application and documentation tasks.
   - Update implementation task status and `Coder Notes`.

3. Tester agent: use `$kayu-tester`.

   - Read the markdown plan and implementation diff.
   - Add focused automated tests under the closest `__tests__` layer.
   - Run useful validation commands.
   - Update testing task status and `Tester Notes`.

4. Planner agent: use `$kayu-planner` again.
   - Re-read the plan and final diff.
   - Verify architecture boundaries, SOLID notes, i18n, constants, nullable API handling, and tests.
   - Update `Planner Verification Notes` and set `Status: verified` only when complete.

## Completion Gate

The workflow is complete when the plan status is `verified`, all implementation and testing tasks are checked, and any skipped validation is explained with a concrete blocker.
