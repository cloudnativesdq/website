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

const SITE_URL = "https://cloudnativesdq.org";

for (const path of PAGES) {
  test(`${path} publishes its own social metadata`, async ({ page, request }) => {
    await page.goto(path);
    const head = page.locator("head");
    const meta = (attr: string, key: string) => head.locator(`meta[${attr}="${key}"]`).first().getAttribute("content");
    const canonical = await head.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical").toBe(path === "/" ? SITE_URL : `${SITE_URL}${path}`);
    expect(await meta("property", "og:url"), "og:url").toBe(canonical);
    const title = await page.title();
    expect(await meta("property", "og:title"), "og:title").toBe(title);
    expect(await meta("name", "twitter:title"), "twitter:title").toBe(title);
    const description = await meta("name", "description");
    const ogDescription = await meta("property", "og:description");
    expect(ogDescription, "og:description").toBeTruthy();
    if (path !== "/") {
      const home = await request.get("/");
      const homeOg = (await home.text()).match(/property="og:description" content="([^"]*)"/)?.[1];
      expect(ogDescription, "og:description must not be inherited from home").not.toBe(homeOg);
    }
    expect(await meta("property", "og:type")).toBe("website");
    expect(await meta("name", "twitter:description"), "twitter:description").toBe(await meta("property", "og:description"));
    expect(description, "description").toBeTruthy();
    expect(await meta("name", "twitter:card")).toBe("summary_large_image");
    expect(await meta("property", "og:site_name")).toBe("Cloud Native Santo Domingo");
    expect(await meta("property", "og:locale")).toBe("es_DO");
    const image = await meta("property", "og:image");
    expect(image, "og:image").toBeTruthy();
    expect((await request.get(new URL(image!).pathname)).status(), "og:image status").toBe(200);
    await expect(head.locator('meta[name="keywords"]')).toHaveCount(0);
    await expect(head.locator("link[hreflang]")).toHaveCount(0);
  });
}

test("every page has its own 1200x630 PNG preview under 300KB", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const head = page.locator("head");
    const og = await head.locator('meta[property="og:image"]').first().getAttribute("content");
    const alt = await head.locator('meta[property="og:image:alt"]').first().getAttribute("content");
    const twitter = await head.locator('meta[name="twitter:image"]').first().getAttribute("content");
    expect(og, `${path} og:image`).toBeTruthy();
    expect(alt?.trim(), `${path} og:image:alt`).toBeTruthy();
    await expect(head.locator('meta[property="og:image:type"]').first(), `${path} og:image:type`).toHaveAttribute("content", "image/png");
    await expect(head.locator('meta[property="og:image:width"]').first(), `${path} og:image:width`).toHaveAttribute("content", "1200");
    await expect(head.locator('meta[property="og:image:height"]').first(), `${path} og:image:height`).toHaveAttribute("content", "630");
    expect(twitter, `${path} twitter:image`).toBe(og);
    seen.add(og!);
    const url = new URL(og!);
    const res = await request.get(url.pathname + url.search);
    expect(res.status(), `${path} image status`).toBe(200);
    expect(res.headers()["content-type"], `${path} content-type`).toContain("image/png");
    const body = await res.body();
    expect(body.length, `${path} bytes`).toBeLessThan(307200);
    // PNG IHDR: width and height are big-endian uint32 at bytes 16 and 20.
    expect([body.readUInt32BE(16), body.readUInt32BE(20)], `${path} size`).toEqual([1200, 630]);
  }
  expect(seen.size, "distinct images").toBe(PAGES.length);
  expect((await request.get("/og-image.jpg")).status()).toBe(404);
});

test("sitemap lists only the site's own pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.sort()).toEqual(PAGES.map((p) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`)).sort());
  expect(xml).not.toMatch(/luma\.com|lu\.ma|ocgroups\.dev/);
});

test("home JSON-LD is a graph of Organization, WebSite and Events", async ({ page, request }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!);
  const graph: Record<string, unknown>[] = data["@graph"];
  const org = graph.find((n) => n["@type"] === "Organization")!;
  const site = graph.find((n) => n["@type"] === "WebSite")!;
  expect(org, "Organization").toBeTruthy();
  expect(site, "WebSite").toBeTruthy();
  expect(org).not.toHaveProperty("event");
  expect(org.alternateName).toBe("Cloud Native SDQ");
  expect(raw).not.toContain("CNCD");
  expect((site.publisher as { "@id": string })["@id"]).toBe(org["@id"]);
  const events = graph.filter((n) => n["@type"] === "Event");
  // The build only has events when the data sources answered and something is upcoming.
  if (events.length === 0) test.info().annotations.push({ type: "note", description: "no upcoming events: Event node checks did not run" });
  for (const event of events) {
    expect((event.organizer as { "@id": string })["@id"]).toBe(org["@id"]);
    expect(event.startDate).toBeTruthy();
    expect(event.endDate).not.toBe(event.startDate);
    expect((event.offers as { price: number }).price).toBe(0);
  }
  const logo = org.logo as string;
  expect(logo).toBe(`${SITE_URL}/brand/icon-512.png`);
  const res = await request.get(new URL(logo).pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

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
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /Saltar al contenido|Skip to content/ });
  await expect(skip).toBeFocused();
  // sr-only leaves a 1x1 box that still counts as visible, so check the focused size.
  expect((await skip.boundingBox())?.width ?? 0).toBeGreaterThan(10);
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
