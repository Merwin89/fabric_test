# ParaBank Test Automation

This is my Playwright testing framework for ParaBank - a demo banking app. Built it using TypeScript and the Page Object Model pattern to keep things organized and maintainable.

## What's Inside

- Page Object Model pattern to keep test code clean
- Custom fixtures so I don't have to repeat setup code everywhere
- Both UI and API tests
- Generates unique usernames for each test run so there's no conflicts
- Works across Chrome, Firefox, and Safari
- Ready to plug into CI/CD pipelines
- TypeScript throughout for better autocompletion and catching errors early

## Project Structure

Here's how I organized the code:

```
src/
  ├── pages/              # Page Object classes
  │   ├── BasePage.ts
  │   ├── RegisterPage.ts
  │   ├── LoginPage.ts
  │   ├── AccountsOverviewPage.ts
  │   ├── OpenAccountPage.ts
  │   ├── TransferFundsPage.ts
  │   ├── BillPayPage.ts
  │   ├── FindTransactionsPage.ts
  │   └── NavigationMenu.ts
  ├── fixtures/           # Custom Playwright fixtures
  │   └── test.fixtures.ts
  ├── utils/              # Helper utilities
  │   ├── test-data.util.ts
  │   └── api.util.ts
  └── types/              # TypeScript type definitions
      └── user.types.ts
tests/
  ├── parabank-ui.spec.ts    # UI E2E tests
  └── parabank-api.spec.ts   # API tests
```

### Run everything

npx playwright test


### Run specific tests

# Just the UI tests
npx playwright test parabank-ui.spec.ts

# Just the API tests
npx playwright test parabank-api.spec.ts

### Check the report

npx playwright show-report


## What the Tests Cover

### UI Tests (`tests/parabank-ui.spec.ts`)

The main UI test does a complete user journey:
- Registers a new user (with a unique username each time)
- Checks that you're logged in automatically
- Navigates around the app
- Opens a checking account
- Creates a savings account
- Transfers money between accounts
- Pays a bill
- Verifies all the balances are correct

### API Tests (`tests/parabank-api.spec.ts`)

The API test grabs transaction data from the UI test and then:
- Searches for transactions by amount
- Validates the JSON responses look right
- Checks all the transaction details match
- Fetches transactions by ID to make sure that works too

## How It's Built

### Page Objects

I set up each page as its own class that extends `BasePage`. The base class handles common stuff like:
- Going to pages
- Waiting for elements
- Clicking and filling forms
- Basic assertions

This way I don't repeat the same code everywhere.

### Fixtures

Instead of setting up page objects in every test, I made them available as fixtures:

```typescript
import { test, expect } from '../src/fixtures/test.fixtures';

test('example', async ({ registerPage, navigationMenu, transactionAPI }) => {
  // Everything's already set up and ready to use
});
```

Saves a ton of boilerplate.

### Test Data

Every test run generates unique usernames (using timestamps + random IDs) so tests never conflict with each other. There's also helpers for generating random transaction amounts and user info. Everything's properly typed so you get autocomplete.

## Configuration

Most of the config is in `playwright.config.ts`. Key things:
- Points to the ParaBank demo site
- 90 second timeout per test (ParaBank can be slow sometimes)
- Takes screenshots and videos when tests fail
- Saves traces for debugging

When running locally, tests run in parallel. On CI it runs them one at a time with retries enabled.

## Reports

After running tests, Playwright generates an HTML report. Just run `npx playwright show-report` to see it.

If anything fails, you get:
- Screenshots of what went wrong
- Videos showing the whole test
- Trace files you can replay step-by-step

## Debugging

When tests fail, everything gets saved to `test-results/`. Use `--debug` mode to step through tests line by line, or open the trace files with `npx playwright show-trace trace.zip`.

### Heads up

**Cloudflare**: The demo site sometimes shows a security check. I built in a 10-15 second wait to handle that.

**ParaBank flakiness**: The backend throws 500 errors randomly sometimes. The retry logic usually catches it but don't be surprised if you see intermittent failures.

## API Endpoints

The ParaBank API is at `https://parabank.parasoft.com/parabank/services_proxy/bank`

Endpoints I'm testing:
- Get transactions by amount: `GET /accounts/{accountId}/transactions/amount/{amount}`
- Get all transactions: `GET /accounts/{accountId}/transactions`
- Get single transaction: `GET /transactions/{transactionId}`
- Get account info: `GET /accounts/{accountId}`

## Adding More Tests

### New page objects
1. Extend the `BasePage` class
2. Set up your locators in the constructor (make them `readonly`)
3. Add methods for navigation, actions, and verifications
4. Register it in `test.fixtures.ts` so it's available everywhere

### New test files
1. Import from the custom fixtures
2. Use the page objects as parameters
3. Break tests into steps with `test.step()`
4. Assert things after each important action

## Tips

### Finding elements
Try to use semantic selectors when possible:
1. `page.getByRole('button', { name: 'Submit' })` is best
2. `page.getByLabel('Username')` is good too
3. `page.locator('#elementId')` works
4. CSS selectors are a last resort

### Test data
- Use `generateUserData()` for users - don't hardcode usernames
- Use `generateRandomAmount()` for money amounts
- Save important IDs (like account numbers) in variables

### Assertions
- Use Playwright's built-in assertions - they auto-wait
- Check things after every important action
- Verify URLs with `expect(page).toHaveURL()`
- Verify text with `expect(element).toHaveText()`

## CI/CD

There's a GitHub Actions workflow in `.github/workflows/playwright.yml` that runs on every push or PR. It installs everything, runs the tests, and uploads the reports. Reports stick around for 30 days.

## Resources

- [Playwright docs](https://playwright.dev) - really good documentation
- [ParaBank demo](https://parabank.parasoft.com/parabank/) - the app I'm testing
- [TypeScript docs](https://www.typescriptlang.org/docs/) - if you need it
