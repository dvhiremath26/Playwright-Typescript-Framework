# Environment-Based Test Data

Test data is stored in one JSON file per environment:

```text
test-data/
  login/
    qa.json
    stage.json
    prod.json
  sales-order/
    qa.json
    stage.json
    prod.json
```

Tests import the selected login data through `src/config/test-data.ts`:

```ts
import { testData } from '@src/config/test-data'

await loginPage.enterUsername(testData.login.username)
await loginPage.enterPassword(testData.login.password)
```

For additional features, use the generic loader with a feature-specific type:

```ts
const salesOrderData = loadFeatureData<SalesOrderData>('sales-order')

await salesOrderPage.createOrder(salesOrderData.standardOrder)
```

## Run Tests

`qa` is the default environment:

```powershell
npx playwright test
```

Set the environment for a single run in PowerShell:

```powershell
$env:TEST_ENV = 'stage'; npx playwright test
$env:TEST_ENV = 'prod'; npx playwright test
```

Set the environment for a single run in Command Prompt:

```bat
set TEST_ENV=stage&& npx playwright test
set TEST_ENV=prod&& npx playwright test
```

Supported values are `qa`, `stage`, and `prod`. Values are case-insensitive. An unsupported value causes the test run to fail immediately with a helpful error.

## Add More Data

Keep the same JSON shape in every environment file. Add a new feature folder with `qa.json`, `stage.json`, and `prod.json`, then load it with `loadFeatureData<T>()`. The type `T` gives tests compile-time checking without requiring a separate loader for every feature.

Do not commit real production passwords or secrets to JSON. Use a secret manager or environment variables for sensitive values.
