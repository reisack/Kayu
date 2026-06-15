# AI Agent Instructions

## Required Reading

Before changing this repository, read:

- `docs/architecture.md`
- `docs/coding-standards.md`
- `docs/testing-guidelines.md`
- `docs/development-workflow.md`

## Working Rules

- Treat this as a React Native TypeScript app with native Android and iOS scaffolding. Keep most application behavior in `src/`.
- Follow the existing folder boundaries: screens in `src/pages`, reusable UI in `src/components`, domain data classes in `src/classes`, and API/scoring/i18n logic in `src/services`.
- Prefer the existing `@/` import alias for application code.
- Keep user-visible strings behind i18n keys in `assets/i18n/fr.json` when adding text.
- Use `Consts` for shared API base URL, request headers, colors, and scale factors instead of scattering duplicate constants.
- When adding API behavior, mirror the existing OpenFoodFacts fetch pattern: request only needed fields, type the response shape, handle nullable fields, and cover success and failure paths with tests.
- When fixing bugs, add or update the closest test under `__tests__/services`, `__tests__/components`, or `__tests__/pages`.
- When refactoring, keep behavior covered by Jest tests and avoid changing native Android/iOS files unless the task requires it.
- Update documentation when the change affects architecture, commands, test strategy, CI, release scripts, or conventions described in `docs/`.

## Definition of Done

- Code is formatted with Prettier and passes ESLint.
- Jest tests pass; coverage can be generated with `npm run test:cov`.
- New or changed behavior has focused tests using the existing Jest and React Native Testing Library patterns.
- API changes preserve typed response mapping and error handling.
- UI changes use existing responsive style patterns based on `useWindowDimensions` and `Consts.style.scaleFactor`.
- Documentation is updated when repository behavior or workflow changes.
