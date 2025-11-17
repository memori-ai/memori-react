import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { env } from 'process';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

/**
 * Playwright configuration for Memori React integration tests
 * Tests run against staging environment with real API calls
 */
export default defineConfig({
  testDir: './e2e/tests',
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  // Test configuration
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: 0,
  workers: env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'e2e/test-results/html' }],
    ['json', { outputFile: 'e2e/test-results/results.json' }],
    ['list']
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for the test application
    baseURL: env.TEST_BASE_URL || 'http://localhost:3000',
    
    // Collect trace on failure for debugging
    trace: 'retain-on-failure',
    
    // Take screenshots on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    // video: 'retain-on-failure',
    
    // Maximum time for each action (click, fill, etc.)
    // actionTimeout: 15000,
    
    // // // Navigation timeout
    // navigationTimeout: 30000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // WebKit disabled due to crashes on macOS (Bus error: 10)
    // Re-enable when Playwright fixes the issue
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Mobile viewports
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    
    // Mobile Safari uses WebKit - disabled for same reason
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  
  // Output folder for test artifacts
  outputDir: 'e2e/test-results/artifacts',
  
  // Folder for test fixtures
  snapshotDir: 'e2e/snapshots',
});

