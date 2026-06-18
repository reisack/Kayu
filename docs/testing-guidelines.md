# Testing Guidelines

## Test Frameworks

The repository uses:

- Jest with the `react-native` preset.
- `@testing-library/react-native` for component and page rendering.
- `react-test-renderer` for snapshot support.
- `jest-fetch-mock` for fetch-based API tests.
- `jest-mock-random` for deterministic randomization in related-product tests.

Jest is configured in `package.json` and `setupJest.js`. `setupJest.js` enables fetch mocks and suppresses console output during tests.

## Test Organization

Tests are grouped by application layer:

- `__tests__/services`: service and scoring tests.
- `__tests__/components`: reusable UI component tests.
- `__tests__/pages`: screen-level tests.
- `__tests__/services/mocks`: JSON fixtures used by service tests.

Test file names use the source file name plus `-tests`, for example `product-score-tests.tsx`, `related-products-service-tests.ts`, and `barcode-scanner-tests.tsx`.

## Unit Testing Strategy

Service tests focus on business rules and API edge cases:

- Score calculation verifies expected score math, clamping to 100, null/undefined handling, and empty additives.
- Additive information tests cover risk mapping, missing risk data, empty responses, and API failures.
- Related product tests cover successful selection, failed completion fetches, highest-score cases, empty search results, and API errors.
- Product score service tests cover enum-to-i18n-key mapping.

Example service style:

```ts
describe('Score calculation service', () => {
  let scoreCalculationService: ScoreCalculationService;

  beforeEach(() => {
    scoreCalculationService = new ScoreCalculationService();
  });

  it('should calculate expected scores', () => {
    const nutritionValues = new NutritionValues(8.42, 10, 1.2, 3, 10, [
      'en:e100',
    ]);

    const score = scoreCalculationService.getScore(nutritionValues);

    expect(score.fat).toBeCloseTo(84.2);
  });
});
```

## Component and Page Testing Strategy

Component/page tests render React Native components and assert visible text, `testID` elements, navigation calls, loading states, and callback effects.

Repeated practices include:

- Mocking `react-i18next` so `t(key)` returns the key.
- Mocking `Consts` with small deterministic style objects.
- Mocking `useWindowDimensions` to stable width and font scale values.
- Mocking images with numeric module values.
- Mocking navigation hooks and child components when the test is focused on a parent.
- Using `fireEvent`, `waitFor`, and fake timers where the component behavior requires them.

Example component/page style:

```tsx
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: 400,
    fontScale: 1,
  }),
}));

it('renders scan message and toggles torch', () => {
  const { getByText, getByTestId } = render(
    <BarcodeScanner navigation={navigation} />,
  );

  expect(getByText('scanBarcodePlease')).toBeTruthy();
  fireEvent.press(getByTestId('torch-toggle-button'));
  expect(getByText('scanBarcodeLightOn')).toBeTruthy();
});
```

## Mocking Approach

API calls are mocked through `jest-fetch-mock`, enabled globally by `setupJest.js`.

Service tests use `fetchMock.mockResponseOnce(...)`, `fetchMock.mockResponse(...)`, or rejected promises to cover success and failure paths. Component tests also reset fetch mocks in `beforeEach` when imported.

React Native and third-party modules are mocked per test file when they would otherwise require native runtime behavior:

- `react-native-vision-camera`
- `@react-navigation/native`
- `react-native-floating-action`
- `react-native-progress/Bar`
- image assets
- child components

Randomization in `RelatedProductsService` is made deterministic with `jest-mock-random`.

## Test Naming Conventions

Observed test names use descriptive `should ...` phrasing:

- `should calculate expected scores`
- `should limit scores to 100`
- `should have empty list when API throws an error`
- `should render loading initially, then product details`

The names describe expected behavior rather than implementation details.

## Snapshot Usage

Snapshot coverage exists for `ProductScore` when `score` is `null`. Snapshot use appears limited rather than being the dominant test strategy. Prefer direct behavioral assertions when possible, and update snapshots only when the rendered structure intentionally changes.

## Coverage Expectations

CI runs `npm run test:cov`, and `sonar-project.properties` points Sonar to `coverage/lcov.info`.

No explicit coverage threshold is configured in the repository. The practical expectation is that coverage generation must succeed and provide Sonar with an LCOV report.

Sonar coverage exclusions remove tests, native folders, assets, generated coverage, `node_modules`, JavaScript config files, and JSON from coverage scope while keeping `src/**` as the source area.

## Existing Test Commands

Use the commands already defined in `package.json`:

```bash
npm test
npm run test:cov
```

These commands currently target the Jest service and component suites under `__tests__/services` and `__tests__/components`. Detox end-to-end tests under `e2e/` are not part of the default Jest commands.

Detox scanner-flow tests use the scanner camera interface rather than the real device camera. The default `npm run build:e2e` and `npm run e2e` scripts set `KAYU_E2E=true`, which makes Babel alias `@/services/barcode-scanner/barcode-scanner-camera` to `e2e/barcode-scanner-camera.tsx`. Change `E2E_BARCODE_SCANNER_CAMERA_MOCK.barcode` in that e2e file when a different hardcoded barcode is needed.

`npm run lint` and `npm run prettier` are not test commands, but they are part of validation before running the Android scripts.

## Adding Tests

When adding or changing behavior:

- Add service tests for score math, API response mapping, sorting/filtering, or failure handling.
- Add component tests for rendered text, `testID` elements, loading states, press handlers, alerts, and conditional rendering.
- Add page tests for navigation behavior and screen-level state transitions.
- Put reusable API fixtures under `__tests__/services/mocks`.
- Reset fetch mocks and Jest mocks in `beforeEach` when a test file mutates shared mocks.
