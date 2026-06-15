# Coding Standards

This document describes conventions that are already present in the repository. It avoids one-off choices unless they are necessary to explain an existing file.

## Naming Conventions

- Source files use lowercase hyphenated names: `product-details.tsx`, `related-products-service.ts`, `score-calculation-service.ts`, and matching test names such as `product-details-tests.tsx`.
- React components use PascalCase identifiers inside those files: `ProductDetails`, `ProductScoreList`, `RelatedProductList`, `NotFoundProduct`.
- Service classes use PascalCase names ending in `Service`: `ScoreCalculationService`, `ProductScoreService`, `RelatedProductsService`, `AdditiveInformationsService`.
- Domain classes use PascalCase nouns: `Product`, `Score`, `NutritionValues`, `AdditiveInformation`.
- Test files commonly use `describe('Unit name', ...)` and `it('should ...', ...)`.
- Route names are string literals such as `Home`, `BarcodeScanner`, and `ProductScreen`, and navigation payloads use the shared `NavigationProductProps` type.

## Folder Organization

Application code is kept under `src/`:

- `src/pages`: navigation-level screens.
- `src/components`: reusable UI components.
- `src/services`: API calls, scoring logic, score-label mapping, and i18n setup.
- `src/classes`: product, score, nutrition, and additive data classes.
- `src/shared-types.ts`: API and navigation types used across modules.
- `src/interfaces.ts`: shared style interfaces.
- `src/enums.ts`: product information enum values.
- `src/extensions.ts`: `Nullable<T>` and the array `clear()` extension.

Tests mirror the application layers under `__tests__/components`, `__tests__/pages`, and `__tests__/services`. Service fixtures live under `__tests__/services/mocks`.

## Imports

The repository uses the `@/` alias for application imports. The alias is configured in both `tsconfig.json` and `babel.config.js`.

```ts
import Product from '@/classes/product';
import Consts from '@/consts';
import RelatedProductsService from '@/services/related-products-service';
```

Relative imports are still present for assets and a small number of local cases, especially image `require(...)` calls and generated/native-adjacent setup.

## Component Organization

React components repeatedly follow this structure:

- Imports.
- Local `Props` interface when props exist.
- `const ComponentName: React.FC<Props> = (...) => { ... }`.
- Hooks such as `useTranslation`, `useWindowDimensions`, `useState`, `useEffect`, or `useCallback`.
- Local `StyleSheet.create(...)`.
- Local helper functions.
- JSX return.
- `export default ComponentName`.

Example shape from existing components:

```tsx
interface Props {
  product: Product;
}

const RelatedProductList: React.FC<Props> = ({ product }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Consts.style.secondaryBackgroundColor,
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
    },
  });

  return <View style={styles.container}>{/* ... */}</View>;
};
```

## Styling

Styles are local to components/pages and are created with `StyleSheet.create`. Most UI files derive sizes from `useWindowDimensions()` and `Consts.style.scaleFactor`.

Repeated styling conventions include:

- Use `Consts.style.primaryColor`, `primaryBackgroundColor`, `secondaryBackgroundColor`, `primaryFontColor`, and `secondaryColor` instead of duplicating palette values.
- Use width-based scale factors for spacing and image sizes.
- Use `fontScale` when calculating text sizes in most screen and display components.
- Keep image assets in `assets/images` and load them with `require('../../assets/images/...')`.

## Domain Classes

Domain classes are simple default exports with public fields and constructors. Optional or missing API data is represented as nullish values.

```ts
export default class NutritionValues {
  fat: Nullable<number>;
  sugar: Nullable<number>;
  salt: Nullable<number>;

  constructor(
    fat: Nullable<number> = null,
    sugar: Nullable<number> = null,
    salt: Nullable<number> = null,
  ) {
    this.fat = fat;
    this.sugar = sugar;
    this.salt = salt;
  }
}
```

`Score` centralizes score clamping and total calculation. `Product.empty` provides a safe empty product shape for component state.

## Services and Dependency Creation

There is no dependency injection framework. Existing code creates services directly at the call site or in a constructor:

- `ProductDetails` creates `ScoreCalculationService` while mapping product API data.
- `RelatedProductsService` creates a `ScoreCalculationService` in its constructor.
- `ProductScore` creates `ProductScoreService` to map enum values to translation keys.
- `RelatedProductList` creates `RelatedProductsService` before loading suggestions.

`AdditiveInformationsService` is a static service with an internal additive risk list initialized by `App`.

## Error Handling

Observed error handling depends on the caller:

- App initialization catches additive initialization failures and shows a translated Android toast.
- Product fetch failures are logged, surfaced with `ToastAndroid.show`, and converted into the not-found product state.
- Related product fetch failures are logged and return an empty related-product list by clearing the array.
- Additive initialization fetch failures log a composed message and reject with an `Error`.

Existing error logs include the failing operation name in the message, such as `getProductByEanCode`, `initAdditiveScoreInformations`, and related-product helper names.

## Logging

Production code uses `console.log` for caught API errors. Tests silence console methods in `setupJest.js`, which keeps expected error-path tests quiet.

No structured logging library is present.

## Configuration Management

Shared runtime constants live in `src/consts.ts`:

- `openFoodFactAPIBaseUrl`
- `httpHeaderGetRequest`
- theme-sensitive colors from `Appearance.getColorScheme()`
- scale factors used by React Native styles

Build and tooling configuration lives at the repository root:

- `package.json` for npm scripts and Jest preset setup.
- `tsconfig.json` for React Native TypeScript config, `noImplicitAny`, and path aliases.
- `.eslintrc.js` for React Native ESLint and no-explicit-any enforcement.
- `.prettierrc.js` for formatting.
- `babel.config.js` for React Native Babel preset and module alias resolution.
- `metro.config.js` for default Metro config.
- `sonar-project.properties` for Sonar coverage input and exclusions.

## Async Patterns

The codebase uses `async`/`await` for fetch-based services and component data loading. Common UI patterns include:

- `useCallback` around async component loaders that are dependencies of `useEffect`.
- `useRef(true)` with `isMounted.current` checks before setting state after async work.
- Loading state initialized to `true`, then set to `false` after successful async completion.
- `try`/`catch` around external API calls.

Examples include `ProductDetails.getProductByEanCode`, `RelatedProductList.getRelatedproducts`, and `RelatedProductsService` private fetch helpers.

## Validation and Nullability

OpenFoodFacts fields are represented with `Nullable<T>` when data can be missing:

```ts
export type ProductApi = {
  'saturated-fat_100g': Nullable<number>;
  sugars_100g: Nullable<number>;
  additives_tags: Nullable<string[]>;
};
```

Score display checks both nutrition values and scores before rendering a `ProductScore`. Score calculation also avoids calculating fields that are `null` or `undefined`.

There is no schema validation library in the current codebase. Validation is done with TypeScript types, nullish checks, optional chaining, and API status/count checks.

## Localization

UI components use `useTranslation` and pass i18n keys to `t(...)`. Services such as `ProductScoreService` return translation keys rather than translated strings, leaving translation to UI components.

The current resource file is `assets/i18n/fr.json`, and `i18n-service` sets both `lng` and `fallbackLng` to `fr`.

## Code Review Expectations Inferred from the Repository

No explicit review checklist exists. The repository implies these expectations through scripts, CI, and tests:

- Keep TypeScript strict enough to satisfy `noImplicitAny`.
- Do not introduce explicit `any`; ESLint treats it as an error.
- Format with Prettier.
- Keep tests passing.
- Maintain coverage generation for Sonar by keeping `npm run test:cov` working.
- Add or update tests near the affected layer when changing behavior.

## Refactoring Expectations Inferred from the Repository

Refactors should preserve current boundaries:

- Keep API and scoring behavior in services unless a component-specific fetch is already local to that component.
- Keep reusable product UI in `src/components`.
- Keep route-level state and navigation decisions in `src/pages`.
- Keep shared data shapes in `src/classes` and `src/shared-types.ts`.
- Avoid broad native Android/iOS changes for JavaScript-only behavior.
