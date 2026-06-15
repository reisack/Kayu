# Development Workflow

## Prerequisites

The repository is a React Native TypeScript project. `package.json` declares:

- Node engine: `>=18`
- React Native: `0.80.1`
- React: `19.1.0`
- TypeScript: `5.0.4`

GitHub Actions currently runs CI with Node 22 and installs dependencies with `npm ci`.

## Install Dependencies

Use the lockfile-backed install command used by CI:

```bash
npm ci
```

For local iterative work, `npm install` may also work, but the repository's CI contract is `npm ci`.

## Local Development Commands

Start Metro:

```bash
npm run start
```

Run Android after formatting, linting, and tests:

```bash
npm run android
```

Run Android release mode after formatting, linting, and tests:

```bash
npm run android:release
```

Run iOS:

```bash
npm run ios
```

The iOS command does not include the format/lint/test preflight that the Android scripts include.

## Build Commands

Clean Android build output:

```bash
npm run clean:android
```

Build an Android App Bundle:

```bash
npm run aab
```

The Android release build reads signing values from Gradle properties or environment-backed Gradle configuration:

- `KAYU_UPLOAD_STORE_FILE`
- `KAYU_UPLOAD_STORE_PASSWORD`
- `KAYU_UPLOAD_KEY_ALIAS`
- `KAYU_UPLOAD_KEY_PASSWORD`

## Test Commands

Run Jest:

```bash
npm test
```

Run Jest with coverage:

```bash
npm run test:cov
```

Coverage output is consumed by Sonar from `coverage/lcov.info`.

## Lint and Format Commands

Run ESLint:

```bash
npm run lint
```

Run Prettier:

```bash
npm run prettier
```

Formatting uses `.prettierrc.js`:

- single quotes
- trailing commas
- bracket spacing
- no arrow parens for single-argument arrows
- same-line closing bracket where configured

Linting extends `@react-native` and treats explicit `any` as an error.

## Suggested Local Change Loop

The repository does not include a written contribution guide, but the scripts and CI imply this local loop:

1. Install dependencies with `npm ci`.
2. Make focused changes in `src/` and matching tests in `__tests__/`.
3. Run `npm run prettier`.
4. Run `npm run lint`.
5. Run `npm test`.
6. Run `npm run test:cov` when validating CI/Sonar readiness.
7. For Android behavior, use `npm run android`; for iOS behavior, use `npm run ios`.

## Agent Workflow

Specification-driven agent work uses the project-local Codex workflow in `.codex/workflows/planner-coder-tester.md`.
All custom agents in this workflow should run with GPT 5.4.

1. Write the requested change in `SPECIFICATIONS.md`.
2. Use `$kayu-planner` to create `.codex/plans/IMPLEMENTATION_PLAN.md` with architecture, SOLID, implementation, testing, and validation notes.
3. Use `$kayu-coder` to implement the planned code and documentation changes.
4. Use `$kayu-tester` to add focused Jest and React Native Testing Library coverage.
5. Use `$kayu-planner` again for final architecture and SOLID verification.

## CI/CD Workflow

The GitHub Actions workflow is `.github/workflows/build.yml`.

It runs on:

- pushes to `main`
- pull requests opened, synchronized, or reopened

The single job is named `SonarQube` and performs:

1. Checkout with `fetch-depth: 0`.
2. Set up Node.js 22.
3. Install dependencies with `npm ci`.
4. Run `npm run test:cov`.
5. Run `SonarSource/sonarqube-scan-action@v5` with `SONAR_TOKEN`.

No separate CI lint job is currently configured. Linting is present as an npm script and as part of the Android run scripts.

## Pull Request Workflow

No PR template or branch naming convention is present in the repository. The observable PR workflow is:

- Pull requests trigger the Build workflow when opened, synchronized, or reopened.
- CI must be able to install dependencies, run Jest coverage, and upload Sonar analysis.
- Tests and coverage are therefore part of the expected review signal.

## Release Workflow

The repository exposes Android release-oriented scripts:

```bash
npm run android:release
npm run aab
```

Android versioning is set in `android/app/build.gradle` with `versionCode` and `versionName`. At the time of writing, `versionName` matches the package version `1.0.8`.

No explicit release notes process, tag process, Play Store upload automation, or iOS release workflow is documented in the repository.

## API Exploration

`api-documentation/fr.rest` contains REST examples for the OpenFoodFacts endpoints used by the app:

- product lookup by EAN
- product lookup with selected fields
- additive taxonomy
- related products by category
- related product display data by EAN code list

Use it as the existing API scratchpad when checking OpenFoodFacts requests.
