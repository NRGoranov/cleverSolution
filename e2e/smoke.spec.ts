import { test, expect } from "@playwright/test";

test.describe("CleverSolutions smoke tests", () => {
  test("homepage renders with hero and categories", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Категории" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Clever Solution" }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "За нас" }).first()).toBeVisible();
  });

  test("about page shows bilingual company description", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Кои сме ние?" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Who we are?" })
    ).toBeVisible();
    await expect(page.getByText("CLEVER SOLUTION Ltd")).toBeVisible();
  });

  test("hero category images link to category pages", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: "Професионално кухненско оборудване", exact: true })
      .click();
    await expect(page).toHaveURL(/\/kitchen/);
  });

  test("mobile nav opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Отвори менюто" });
    await menuButton.click();

    const mobileNav = page.getByRole("navigation", { name: "Мобилна навигация" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "За нас" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Въпроси" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Контакти" })).toBeVisible();

    await page.getByRole("button", { name: "Затвори менюто" }).click();
    await expect(mobileNav).toBeHidden();
  });

  test("mobile menu floats over the page without expanding the navbar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));
    const header = page.locator("header").first();
    await expect
      .poll(async () => (await header.boundingBox())?.height ?? 999)
      .toBeLessThan(58);

    const headerBefore = await header.boundingBox();
    expect(headerBefore).toBeTruthy();

    await page.getByRole("button", { name: "Отвори менюто" }).click();

    const mobileNav = page.getByRole("navigation", { name: "Мобилна навигация" });
    await expect(mobileNav).toBeVisible();

    const headerAfter = await header.boundingBox();
    const navBox = await mobileNav.boundingBox();
    expect(headerAfter).toBeTruthy();
    expect(navBox).toBeTruthy();
    expect(Math.abs(headerAfter!.height - headerBefore!.height)).toBeLessThan(8);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeGreaterThan(50);
    expect(navBox!.y).toBeGreaterThan(headerAfter!.y);
  });

  test("draft products do not appear on category pages", async ({ page }) => {
    await page.goto("/kitchen");
    await expect(
      page.getByText("Примерен draft продукт — не публикуван")
    ).toHaveCount(0);
  });

  test("category page shows product grid when published products exist", async ({
    page,
  }) => {
    await page.goto("/kitchen");
    await expect(
      page.getByRole("heading", {
        name: "Електрически конвектомат iCombi PRO® XS",
      })
    ).toBeVisible();
    await expect(page.getByText("39 продукта")).toBeVisible();
  });

  test("product detail page changes content by slug", async ({ page }) => {
    await page.goto("/product/icp-xs");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Електрически конвектомат iCombi PRO® XS",
      })
    ).toBeVisible();
    await expect(page.getByText("iCP XS").first()).toBeVisible();

    await page.goto("/product/icp-6-1-1");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Електрически конвектомат iCombi PRO® 6-11",
      })
    ).toBeVisible();
    await expect(page.getByText("6х 1/1-GN").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Електрически конвектомат iCombi PRO® XS",
      })
    ).toHaveCount(0);
  });

  test("contact about product prefills the form", async ({ page }) => {
    await page.goto(
      "/contact?product=" +
        encodeURIComponent("Електрически конвектомат iCombi PRO® XS")
    );
    const productField = page.getByRole("textbox", { name: "Продукт" });
    await expect(productField).toHaveValue(
      "Електрически конвектомат iCombi PRO® XS"
    );
  });

  test("contact form submit succeeds (mocked endpoint)", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, testMode: true }),
      });
    });

    await page.goto("/contact");
    const nameField = page.locator("#name");
    await expect(nameField).toBeVisible();
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Това е тестово съобщение за smoke test.");
    await nameField.fill("Тест Потребител");
    await expect(nameField).toHaveValue("Тест Потребител");
    await page.getByRole("button", { name: "Изпратете съобщението" }).click();

    await expect(
      page.getByText("Благодарим ви! Съобщението е изпратено успешно.")
    ).toBeVisible({ timeout: 10000 });
  });
});
