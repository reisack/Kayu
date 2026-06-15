---
name: kayu-agent-harness
description: Orchestrate Kayu specification-driven changes through the multi-agent harness from the root SPECIFICATIONS.md file. Use when Codex should run the full Kayu planner-coder-tester workflow, spawn role agents for planning, implementation, tests, and final verification, or coordinate .codex/plans/IMPLEMENTATION_PLAN.md as the handoff contract.
---

# Kayu Agent Harness

## Overview

Use this skill to coordinate the complete Kayu specification workflow through the agent harness. The root `SPECIFICATIONS.md` is the source of truth, `.codex/plans/IMPLEMENTATION_PLAN.md` is the shared handoff document, and the role skills `$kayu-planner`, `$kayu-coder`, and `$kayu-tester` do the specialized work.

## Required Model

Run role agents with GPT 5.4 when the harness allows an explicit model override. If the harness inherits a suitable model by default and the user did not request a model, follow the harness rules.

## Preflight

1. Read `SPECIFICATIONS.md`.
2. Read `AGENTS.md`, `docs/architecture.md`, `docs/coding-standards.md`, `docs/testing-guidelines.md`, and `docs/development-workflow.md`.
3. Read `.codex/workflows/planner-coder-tester.md`.
4. Confirm `.codex/skills/kayu-planner`, `.codex/skills/kayu-coder`, and `.codex/skills/kayu-tester` exist before spawning role agents.
5. Inspect the current git status so later review can distinguish existing user edits from agent edits.

## Harness Workflow

Use `multi_agent_v1.spawn_agent` for each role when available. Keep each agent prompt bounded, name the role skill explicitly, and tell coding agents they are not alone in the codebase and must not revert unrelated edits.

Run the agents in sequence because each step depends on the plan state from the previous step:

1. Planner: spawn one agent to use `$kayu-planner` and create `.codex/plans/IMPLEMENTATION_PLAN.md` from `SPECIFICATIONS.md`.
2. Coder: after the plan exists and has `Status: planned`, spawn one agent to use `$kayu-coder` and implement only the plan.
3. Tester: after coder completion and `Status: implemented`, spawn one agent to use `$kayu-tester`, add focused automated tests, and run useful validation.
4. Planner verification: after tester completion and `Status: tested`, spawn one agent to use `$kayu-planner` again for final architecture, SOLID, i18n, constants, typed API, and test verification.

Wait for each agent before starting the next role. Review each final response and the plan file before continuing. If an agent reports a blocker, inspect the files and either resolve it locally when small and clearly within the current role's scope, or report the blocker with exact file paths and commands.

## Prompt Templates

Planner prompt:

```text
Use $kayu-planner in D:\Dev\javascript\Kayu to create .codex/plans/IMPLEMENTATION_PLAN.md from SPECIFICATIONS.md. Read the required Kayu docs and inspect relevant source/tests before writing the plan. Do not implement code.
```

Coder prompt:

```text
Use $kayu-coder in D:\Dev\javascript\Kayu to implement .codex/plans/IMPLEMENTATION_PLAN.md. You are not alone in the codebase: do not revert unrelated edits, and adapt to any existing changes you find. Implement only planned application and documentation tasks, update implementation task status, and add Coder Notes.
```

Tester prompt:

```text
Use $kayu-tester in D:\Dev\javascript\Kayu after the implementation. You are not alone in the codebase: do not revert unrelated edits, and adapt to any existing changes you find. Add focused automated tests near the changed services/components/pages, run useful validation, update testing task status, and add Tester Notes.
```

Final planner verification prompt:

```text
Use $kayu-planner in D:\Dev\javascript\Kayu for final verification after coding and testing. Re-read .codex/plans/IMPLEMENTATION_PLAN.md and the final diff, verify Kayu architecture boundaries and SOLID notes, review validation results, update Planner Verification Notes, and set Status: verified only if the completion gate is satisfied.
```

## Completion Gate

Finish only when:

- `.codex/plans/IMPLEMENTATION_PLAN.md` exists.
- Plan `Status` is `verified`.
- Implementation and testing tasks are checked or have explicit blockers.
- Validation commands have passed or each skipped command has a concrete reason.
- Final git status and changed files are summarized for the user.

If the harness tools are unavailable, do not pretend the workflow ran. Fall back to explaining that role agents cannot be spawned in the current environment, then perform the next best local workflow only if the user asks to continue without the harness.
