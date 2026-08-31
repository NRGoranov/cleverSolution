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

  test("mobile menu expands inside the sticky navbar, not a full-page overlay", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));

    await page.getByRole("button", { name: "Отвори менюто" }).click();

    const mobileNav = page.getByRole("navigation", { name: "Мобилна навигация" });
    await expect(mobileNav).toBeVisible();

    const header = page.locator("header").first();
    const box = await header.boundingBox();
    expect(box).toBeTruthy();
    // Floating compact card: inset from the viewport, not a full-screen sheet.
    expect(box!.x).toBeGreaterThan(8);
    expect(box!.width).toBeLessThan(360);
    expect(box!.height).toBeLessThan(640);
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
