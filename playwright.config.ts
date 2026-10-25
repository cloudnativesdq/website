import { defineConfig, devices } from "@playwright/test";

// End-to-end smoke tests against the production build (`pnpm build` first). CI runs them on every
// PR, so a dependency bump only auto-merges when the site still works.
// E2E_PORT lets two worktrees run the suite at once without testing each other's server.
const PORT = Number(process.env.E2E_PORT || 3100);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 860 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
