# Memori React E2E Tests

Integration tests for the Memori React widget using Playwright.

## Overview

These tests verify critical user flows against a staging environment with **30+ comprehensive tests** covering main features:

1. **Session Initialization** (4 tests) - Widget loading and session creation
2. **Chat Messaging** (4 tests) - Core conversation functionality
3. **File Upload** (5 tests) - File upload functionality including PDF and images
4. **TTS Audio** (3 tests) - Text-to-speech controls
5. **Layouts** (5 tests) - Multiple layout configurations
6. **Reasoning Display** (3 tests) - showReasoning prop with think tags
7. **Artifact System** (5 tests) - Artifact detection and display

> **Note:** Authentication tests are excluded because this project uses magic link authentication, which requires email interaction and is not suitable for automated testing.

## Setup

### Install Dependencies

```bash
yarn install
npx playwright install --with-deps
```

## Running Tests

### Run all tests

```bash
yarn test:e2e
```

### Run specific test suite

```bash
yarn test:e2e tests/01-session-initialization.spec.ts
```

### Run with UI mode (interactive)

```bash
yarn test:e2e:ui
```

### Run in headed mode (see browser)

```bash
yarn test:e2e:headed
```

### Debug mode

```bash
yarn test:e2e:debug
```

### Run specific browser

```bash
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=mobile-chrome

# WebKit/Safari temporarily disabled due to crashes
# yarn test:e2e --project=webkit
```

### Run specific test

```bash
yarn test:e2e --grep "should initialize session"
```

### Run with mocked API responses

For faster, more reliable tests that don't depend on staging API:

```bash
TEST_USE_MOCK=true yarn test:e2e
```

Or configure it in `.env.test`:

```env
TEST_USE_MOCK=true
```

**Use mock in specific tests:**

```typescript
// In test file
test('my test', async () => {
  // Mock specific response with custom data
  await widget.chatPanel.mockApiResponse({
    message: 'Custom response text',
    media: [
      {
        url: 'https://example.com/image.jpg',
        mimeType: 'image/jpeg',
        title: 'Sample Image'
      }
    ]
  });
  
  await widget.chatPanel.sendMessage('test message', true);
});
```

**Supported media types in mocks:**
- Images: `image/jpeg`, `image/png`, `image/gif`
- Documents: `application/pdf`
- Videos: `video/mp4`, `video/webm`
- Audio: `audio/mpeg`, `audio/wav`
- Links: `text/html`

## Test Structure

```
e2e/
├── tests/                      # Test suites
│   ├── 01-session-initialization.spec.ts
│   ├── 02-chat-messaging.spec.ts
│   ├── 03-file-upload.spec.ts
│   ├── 04-tts-audio.spec.ts
│   ├── 05-layouts.spec.ts
│   ├── 06-reasoning.spec.ts
│   └── 07-artifacts.spec.ts
├── page-objects/              # Page object models
│   ├── MemoriWidget.ts
│   ├── StartPanel.ts
│   └── ChatPanel.ts
├── fixtures/                  # Test data and helpers
│   ├── test-data.ts
│   ├── helpers.ts
│   └── test-files/
│       ├── test-document.pdf
│       ├── test-image.jpg
│       └── test-document.txt
└── test-results/              # Generated reports
```

## Page Object Model

Tests use the Page Object Model pattern for better maintainability:

```typescript
// Example: Using page objects
const widget = new MemoriWidget(page);

// Navigate to widget
await widget.goto({
  memoriID: 'test-memori-id',
  ownerUserID: 'owner-id',
  tenantID: 'www.aisuru.com',
});

// Start session
await widget.startPanel.startSession();

// Send message
await widget.chatPanel.sendMessage('Hello');
await widget.chatPanel.waitForMemoriResponse();
```

### Age Verification Support

The Page Objects include comprehensive support for age verification:

```typescript
import { createBirthDate } from '../fixtures/test-data';

// Check if age verification modal is present
const hasAgeModal = await widget.startPanel.hasAgeVerificationModal();

if (hasAgeModal) {
  // Option 1: Complete age verification with specific date
  await widget.startPanel.completeAgeVerification(15, 6, 1990);
  
  // Option 2: Use helper to generate birthdate
  const birthDate = createBirthDate(25); // 25 years old
  await widget.startPanel.completeAgeVerification(
    birthDate.day,
    birthDate.month,
    birthDate.year
  );
}

// Pre-populate birthdate in localStorage (skip modal)
const birthDate = createBirthDate(25);
await widget.setBirthDateInLocalStorage(birthDate.iso);

// Check if birthdate exists
const hasBirthDate = await widget.hasBirthDateInLocalStorage();

// Clear birthdate
await widget.clearBirthDateFromLocalStorage();
```

**Important:** Age verification uses localStorage to persist the birthdate. Once verified, the modal won't appear again unless localStorage is cleared.

## Writing New Tests

### 1. Create test file

```typescript
import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig } from '../fixtures/test-data';

test.describe('My Feature', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
  });

  test('should do something', async () => {
    // Your test code
  });
});
```

### 2. Use helpers

```typescript
import { waitForAPIResponse, getSessionID } from '../fixtures/helpers';

// Wait for specific API call
await waitForAPIResponse(page, '/openSession');

// Get session ID
const sessionID = await getSessionID(page);
```

### 3. Use selectors from test-data

```typescript
import { selectors } from '../fixtures/test-data';

// Use predefined selectors
const chatInput = page.locator(selectors.chatInput);
```

## Test Coverage

### File Upload Tests (03-file-upload.spec.ts)

Tests comprehensive file upload functionality:
- Upload button visibility and menu opening
- **PDF document upload flow**: Full workflow from button click to document display in chat
- **JPG image upload flow**: Complete image upload with chat verification
- **Multiple image formats**: Testing various image types (JPG, PNG, GIF)
- Uploaded media verification in chat bubbles

### Reasoning Tests (06-reasoning.spec.ts)

Tests `showReasoning` prop functionality:
- **Show reasoning**: When `showReasoning={true}`, `<think>` tags display as expandable details
- **Hide reasoning**: When `showReasoning={false}`, `<think>` content is hidden
- **Expand reasoning**: Interactive expansion of reasoning details element

### Artifact Tests (07-artifacts.spec.ts)

Tests artifact detection and display system:
- **HTML artifacts**: Detection and rendering of `text/html` artifacts
- **Markdown artifacts**: Detection and rendering of `text/markdown` artifacts
- **JavaScript artifacts**: Detection and rendering of `text/javascript` code artifacts
- **Artifact isolation**: Verifies artifacts only appear in memori responses, not user messages
- **Multiple artifacts**: Handling multiple artifacts in a single response

## Best Practices

### 1. Wait for elements properly

```typescript
// ✅ Good - wait for element to be visible
await element.waitFor({ state: 'visible' });

// ❌ Bad - arbitrary timeout
await page.waitForTimeout(5000);
```

### 2. Use page objects

```typescript
// ✅ Good - use page object methods
await widget.startPanel.startSession();

// ❌ Bad - direct element manipulation
await page.click('.memori--start-button');
```

### 3. Test against real APIs

These are integration tests, not unit tests. They should:
- Use real API endpoints (staging)
- Test actual user flows
- Verify end-to-end functionality

### 4. Handle flaky tests

```typescript
// Use retry logic for network-dependent tests
test.describe.configure({ retries: 2 });

// Wait for API responses
await page.waitForResponse(response => 
  response.url().includes('/api') && response.status() === 200
);
```

### 5. Clean up after tests

```typescript
test.afterEach(async ({ page }) => {
  // Clear localStorage
  await page.evaluate(() => localStorage.clear());
  
  // Close any open modals/drawers
  await page.keyboard.press('Escape');
});
```

## Debugging Tests

### View test trace

```bash
yarn test:e2e:report
```

### Debug specific test

```bash
yarn test:e2e:debug tests/02-chat-messaging.spec.ts
```

### Take screenshots

```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
await widget.screenshot('widget-screenshot.png');
```

### Inspect element

```typescript
// Pause execution for manual inspection
await page.pause();
```

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Manual workflow dispatch

### View Results

Test results and artifacts are uploaded to GitHub Actions:
- HTML reports: `playwright-html-report-{browser}`
- Test results: `playwright-report-{browser}`


### Tests passing locally but failing in CI

1. **Check CI environment variables** in GitHub Secrets
2. **Verify network access** from CI to staging
3. **Check browser versions** match between local and CI

### Slow tests

1. **Run in parallel**
   ```bash
   yarn test:e2e --workers=4
   ```

2. **Run specific browser**
   ```bash
   yarn test:e2e --project=chromium
   ```

3. **Skip slow tests**
   ```typescript
   test.skip('slow test', async () => {
     // ...
   });
   ```

## Contributing

When adding new features:

1. Add tests for critical user flows
2. Use page object pattern
3. Follow existing test structure
4. Update this README if needed
5. Ensure tests pass locally before pushing

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Memori API Client](https://github.com/memori-ai/memori-api-client)
- [Project README](../README.md)

