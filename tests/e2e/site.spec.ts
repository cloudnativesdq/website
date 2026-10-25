import { test, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { translations } from "../../src/lib/translations";

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
  // freeCodeCamp videos open by default.
  await expect(grid.getByRole("tab", { selected: true })).toContainText(/Videos/i);
  await tabs.first().click();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(grid.locator("ul > li").first()).toBeVisible();
});

test("head declares the brand icons, manifest and theme color", async ({ page, request }) => {
  await page.goto("/");
  const head = page.locator("head");
  const href = (selector: string) => head.locator(selector).first().getAttribute("href");
  const icons = [
    await href('link[rel="icon"][href*="favicon.ico"]'),
    await href('link[rel="icon"][type="image/svg+xml"]'),
    await href('link[rel="apple-touch-icon"]'),
  ];
  for (const url of icons) {
    expect(url, "icon link").toBeTruthy();
    expect((await request.get(url!)).status(), url!).toBe(200);
  }
  await expect(head.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]')).toHaveAttribute("content", "#090d16");
  await expect(head.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]')).toHaveAttribute("content", "#f7f9fc");

  const manifestUrl = await href('link[rel="manifest"]');
  expect(manifestUrl, "manifest link").toBeTruthy();
  const manifest = await (await request.get(manifestUrl!)).json();
  expect(manifest.short_name.length).toBeLessThanOrEqual(12);
  const purposes = manifest.icons.map((i: { sizes: string; purpose: string }) => `${i.sizes} ${i.purpose}`);
  expect(purposes).toEqual(expect.arrayContaining(["192x192 any", "512x512 any", "512x512 maskable"]));
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src);
    expect(res.status(), icon.src).toBe(200);
    expect(res.headers()["content-type"], icon.src).toContain("image/png");
  }

  expect((await request.get("/favicon.ico")).status()).toBe(200);
  for (const gone of ["/favicon.svg", "/images/logo.png"]) {
    expect((await request.get(gone)).status(), gone).toBe(404);
  }
});

test("navbar and footer home links show the lockup", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav").first().getByRole("link", { name: "Cloud Native Santo Domingo", exact: true })).toBeVisible();
  await expect(page.locator("footer").last().getByRole("link", { name: "Cloud Native Santo Domingo", exact: true })).toBeVisible();
});

test("unknown URLs get the branded 404 without console errors", async ({ page }) => {
  const errors = collectErrors(page);
  const res = await page.goto("/no-existe", { waitUntil: "networkidle" });
  expect(res?.status()).toBe(404);
  await expect(page.locator("nav").first().getByRole("link", { name: "Cloud Native Santo Domingo", exact: true })).toBeVisible();
  await expect(page.locator("main#main").getByRole("link", { name: /Volver al inicio|Back to home/ })).toHaveAttribute("href", "/");
  expect(errors, "console errors").toEqual([]);
});

test("first Tab focuses the skip link, which moves focus to main", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /Saltar al contenido|Skip to content/ });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("public API endpoints answer JSON", async ({ request }) => {
  for (const path of ["/api", "/api/community", "/api/map", "/api/resources", "/api/people", "/api/wcnf", "/api/programs", "/api/chapter-guide"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain("application/json");
    expect(res.headers()["access-control-allow-origin"], path).toBe("*");
  }
});

test.describe("contact form", () => {
  test.use({ locale: "es-ES" });
  const { es, en } = translations;
  // The web server also reads .env files, so a local key there counts too.
  const hasResendKey =
    !!process.env.RESEND_API_KEY ||
    [".env", ".env.local", ".env.production", ".env.production.local"].some(
      (f) => existsSync(f) && /^\s*RESEND_API_KEY\s*=\s*\S/m.test(readFileSync(f, "utf8")),
    );

  async function fillVisible(page: Page, message = "Hola, quiero dar una charla.") {
    await page.getByLabel(es.nameLabel).fill("Ana");
    await page.getByLabel(es.emailLabel).fill("ana@example.com");
    await page.getByLabel(es.messageLabel).fill(message);
  }

  test("labels are associated and keyboard focus skips the honeypot", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel(es.nameLabel)).toHaveAttribute("name", "name");
    await expect(page.getByLabel(es.emailLabel)).toHaveAttribute("name", "email");
    await expect(page.getByLabel(es.messageLabel)).toHaveAttribute("name", "message");
    await page.getByLabel(es.messageLabel).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: es.sendButton })).toBeFocused();
  });

  test("a filled honeypot gets success without sending", async ({ page }) => {
    test.skip(hasResendKey, "a real key would turn a broken honeypot into a real email");
    await page.goto("/contact");
    await fillVisible(page);
    await page.locator('input[name="hp"]').fill("Bot Inc");
    await page.waitForTimeout(3100); // past the minimum fill time, so only the honeypot can short-circuit
    await page.getByRole("button", { name: es.sendButton }).click();
    // CI has no RESEND_API_KEY, so a real send would show "unavailable": success proves the short-circuit.
    await expect(page.getByRole("heading", { name: es.successMessage })).toBeVisible();
  });

  test("server error codes show translated messages, never server text", async ({ page }) => {
    test.skip(hasResendKey, "needs RESEND_API_KEY unset, or a valid submit sends real email");
    await page.goto("/contact");
    await page.waitForTimeout(3100); // past the minimum fill time
    await fillVisible(page, "corto");
    await page.locator("form").evaluate((f: HTMLFormElement) => { f.noValidate = true; });
    await page.getByRole("button", { name: es.sendButton }).click();
    await expect(page.getByText(es.contactErrors.invalid)).toBeVisible();
    await page.getByRole("button", { name: /Cambiar idioma|Change language/ }).first().click();
    await expect(page.getByText(en.contactErrors.invalid)).toBeVisible();

    await page.getByLabel(en.messageLabel).fill("Hello, I would like to give a talk.");
    await page.getByRole("button", { name: en.sendButton }).click();
    await expect(page.getByText(en.contactErrors.unavailable)).toBeVisible();
    await expect(page.locator("main")).not.toContainText("RESEND");
    await page.getByRole("button", { name: /Cambiar idioma|Change language/ }).first().click();
    await expect(page.getByText(es.contactErrors.unavailable)).toBeVisible();
  });
});
