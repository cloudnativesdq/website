import { test, expect } from "@playwright/test";
import { resolveLanguage } from "../../src/lib/language";

// Pure function checks; no browser needed.
test("resolveLanguage: cookie, Accept-Language, default", () => {
  expect(resolveLanguage("en", "es-DO,es;q=0.9")).toBe("en");
  expect(resolveLanguage("es", "en-US,en;q=0.9")).toBe("es");
  expect(resolveLanguage(undefined, "en-US,en;q=0.9")).toBe("en");
  expect(resolveLanguage(undefined, "fr,es;q=0.8")).toBe("es");
  expect(resolveLanguage(undefined, "de")).toBe("es");
  expect(resolveLanguage(undefined, "fr,en;q=0.3")).toBe("es");
  expect(resolveLanguage("xx", "")).toBe("es");
  expect(resolveLanguage(undefined, undefined)).toBe("es");
  expect(resolveLanguage(undefined, "en ;q=0.9")).toBe("en");
});

test("English server HTML hydrates without console errors", async ({ page, context, baseURL }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource|net::ERR_|status of (4|5)\d\d/.test(m.text())) errors.push(m.text());
  });
  await context.addCookies([{ name: "lang", value: "en", url: baseURL! }]);
  for (const path of ["/", "/events", "/team"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }
  expect(errors, "console errors").toEqual([]);
});

test("pages are visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/events");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("nav").first()).toBeVisible();
  await context.close();
});

test("a lang=en cookie gets English server HTML", async ({ request, baseURL }) => {
  const html = await (await request.get("/", { headers: { Cookie: "lang=en", "Accept-Language": "es-DO,es;q=0.9" } })).text();
  expect(html).toMatch(/<html[^>]* lang="en"/);
  expect(html).toContain("Change language");
  const es = await (await request.get(new URL("/", baseURL).toString(), { headers: { "Accept-Language": "es-DO,es;q=0.9" } })).text();
  expect(es).toMatch(/<html[^>]* lang="es"/);
});

test("toggling the language writes the cookie and updates <html lang>", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/programs", { waitUntil: "networkidle" });
  const html = page.locator("html");
  const before = await html.getAttribute("lang");
  await page.getByRole("button", { name: /Cambiar idioma|Change language/ }).first().click();
  const after = before === "es" ? "en" : "es";
  await expect(html).toHaveAttribute("lang", after);
  const cookie = (await context.cookies()).find((c) => c.name === "lang");
  expect(cookie?.value).toBe(after);
  await page.reload();
  await expect(html).toHaveAttribute("lang", after);
});

test("a language saved in localStorage moves to the cookie once", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/", { waitUntil: "networkidle" });
  const other = (await page.locator("html").getAttribute("lang")) === "es" ? "en" : "es";
  await page.evaluate((l) => localStorage.setItem("lang", l), other);
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", other);
  expect((await context.cookies()).find((c) => c.name === "lang")?.value).toBe(other);
  expect(await page.evaluate(() => localStorage.getItem("lang"))).toBeNull();
});
