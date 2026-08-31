import { test, expect } from "@playwright/test";

const KEY_PAGES = [
  "/",
  "/about",
  "/contact",
  "/kitchen",
  "/security",
  "/faq",
  "/privacy",
  "/terms",
];

test.describe("Launch checklist", () => {
  test("privacy, terms and FAQ pages render", async ({ page }) => {
    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { level: 1, name: "Политика за поверителност" })
    ).toBeVisible();

    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { level: 1, name: "Общи условия" })
    ).toBeVisible();

    await page.goto("/faq");
    await expect(
      page.getByRole("heading", { level: 1, name: "Често задавани въпроси" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Как мога да направя запитване за продукт?",
      })
    ).toBeVisible();
  });

  test("custom 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Страницата не е намерена" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Към началото" })).toBeVisible();
  });

  test("robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("User-Agent");
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("sitemap.xml");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("/privacy");
    expect(sitemapBody).toContain("/terms");
    expect(sitemapBody).toContain("/faq");
    expect(sitemapBody).toContain("/contact");
  });

  test("contact form shows validation errors", async ({ page }) => {
    await page.goto("/contact");
    const nameField = page.getByRole("textbox", { name: "Име", exact: true });
    await expect(nameField).toBeVisible();
    await nameField.fill("A");
    await page.getByRole("textbox", { name: "Имейл" }).fill("not-an-email");
    await page.getByRole("textbox", { name: "Съобщение" }).fill("кратко");
    await page.getByRole("button", { name: "Изпратете съобщението" }).click();

    await expect(
      page.getByText("Моля, въведете име с поне 2 символа.")
    ).toBeVisible();
    await expect(
      page.getByText("Моля, въведете валиден имейл адрес.")
    ).toBeVisible();
    await expect(
      page.getByText("Съобщението трябва да е поне 10 символа.")
    ).toBeVisible();
  });

  test("homepage has clear CTAs and FAQ", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Разгледайте категориите" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Свържете се с нас" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Често задавани въпроси" })
    ).toBeVisible();
  });

  test("no broken internal links from key pages", async ({ page, request }) => {
    test.setTimeout(90_000);
    const seen = new Set<string>();
    const broken: string[] = [];

    for (const start of KEY_PAGES) {
      await page.goto(start);
      const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors
          .map((el) => el.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/") && !href.startsWith("//"))
      );

      for (const href of hrefs) {
        const path = href.split("#")[0] || "/";
        if (seen.has(path)) continue;
        seen.add(path);
        const response = await request.get(path);
        if (response.status() >= 400) {
          broken.push(`${path} (from ${start}, ${response.status()})`);
        }
      }
    }

    expect(broken, broken.join("\n")).toEqual([]);
  });

  test("pages expose a canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /https?:\/\//);
  });
});
