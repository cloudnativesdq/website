import { test, expect, type Page } from "@playwright/test";

// Every page renders its main content, has no console errors and no horizontal scroll.
// External data (OCG, cncf.io, Luma…) can be unavailable in CI, so content checks only rely on
// things the site renders even when it falls back.

const PAGES = ["/", "/events", "/gallery", "/team", "/map", "/programs", "/start-a-chapter", "/resources", "/contact"];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // Third-party resources failing to load (offline CI, blocked images) are not site bugs.
    if (/Failed to load resource|net::ERR_|status of (4|5)\d\d/.test(text)) return;
    errors.push(text);
  });
  return errors;
}

for (const path of PAGES) {
  test(`${path} renders without errors or overflow`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(path, { waitUntil: "networkidle" });
    expect(res?.status(), "HTTP status").toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator("footer").last()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
    expect(errors, "console errors").toEqual([]);
  });
}

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  await page.getByRole("button", { name: /Cambiar tema|Toggle theme/ }).first().click();
  await expect(html).not.toHaveAttribute("data-theme", before ?? "");
});

test("language toggle switches Spanish and English", async ({ page }) => {
  await page.goto("/programs");
  const h1 = page.locator("h1");
  const before = await h1.innerText();
  await page.getByRole("button", { name: /Cambiar idioma|Change language/ }).first().click();
  await expect(h1).not.toHaveText(before);
});

test("navigation reaches every section", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: /Menú|Menu/ }).click();
    await page.getByRole("link", { name: /Mapa CNCF|CNCF map/ }).first().click();
  } else {
    await page.getByRole("button", { name: /Comunidad|Community/ }).click();
    await page.getByRole("link", { name: /Mapa CNCF|CNCF map/ }).first().click();
  }
  await expect(page).toHaveURL(/\/map$/);
});

test("map renders tiles and chapter markers, and the countries panel toggles", async ({ page }) => {
  await page.goto("/map", { waitUntil: "networkidle" });
  const map = page.getByTestId("chapters-map");
  await expect(map.locator(".leaflet-container")).toBeVisible();
  // Leaflet leaves off-screen markers as empty paths, so count them instead of checking visibility.
  await expect.poll(() => map.locator("path.leaflet-interactive").count(), { timeout: 20_000 }).toBeGreaterThan(0);
  const panel = page.locator("#countries-panel");
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: /Países|Countries/ }).click();
  await expect(panel).toBeVisible();
});

test("card grids filter by tab", async ({ page }) => {
  await page.goto("/resources", { waitUntil: "networkidle" });
  const grid = page.locator('[aria-labelledby="resources-grid-title"]');
  const tabs = grid.getByRole("tab");
  expect(await tabs.count()).toBeGreaterThan(1);
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(grid.locator("ul > li").first()).toBeVisible();
});

test("public API endpoints answer JSON", async ({ request }) => {
  for (const path of ["/api", "/api/community", "/api/map", "/api/resources", "/api/people", "/api/wcnf", "/api/programs", "/api/chapter-guide"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain("application/json");
    expect(res.headers()["access-control-allow-origin"], path).toBe("*");
  }
});
