import { expect, Page, test } from "@playwright/test";
import { LoginPage } from "./login.page";
import * as allure from "allure-js-commons";
import { waitForSec } from "../../utils/helpers";

export const goToMigrateESRLink = (page: Page) =>
  test.step("Goto ESR URL", async () => {
    await allure.step("Navigate to ESR URL", async () => {
      await page.goto(process.env.ESR_BASE_URL);
    });
  });

export const goToAliquotLink = (page: Page) =>
  test.step("Goto aliquot URL", async () => {
    await allure.step("Navigate to aliquot URL", async () => {
      await page.goto(process.env.ALIQUOT_BASE_URL);
    });
  });
  
// AWT Environment (legacy - kept for reference)
// AWT Environment (DEPRECATED - No longer available)
// export const goToAliquotAwtLink = (page: Page) =>
//   test.step("Goto aliquot awt URL", async () => {
//     await allure.step("Navigate to aliquot awt URL", async () => {
//       await page.goto(process.env.ALIQUOT_BASE_URL_AWT || 'https://awt.aliquot.live/');
//       await page.waitForTimeout(3500);
//     });
//   });

// QA Environment (PRIMARY - All tests should use this environment)
export const goToAliquotQaLink = (page: Page) =>
  test.step("Goto aliquot qa URL", async () => {
    await allure.step("Navigate to aliquot qa URL", async () => {
      await page.goto(process.env.ALIQUOT_BASE_URL_QA || 'https://qa.aliquot.live/');
      await page.waitForTimeout(3500);
    });
  });

export const loginESR_USERNAME = (
  page: Page,
  username: string,
  password: string
) =>
  test.step("Login as user", async () => {
    await allure.step(
      "Check username field visibility and fill it",
      async () => {
        await expect(
              page.locator('input[name="username"]')
        ).toBeVisible();
        await page
          .locator('input[name="username"]')
          .fill(username);
      }
    );

    await allure.step(
      "Check password field visibility and fill it",
      async () => {
        await expect(
          page.locator('input[name="password"]')
        ).toBeVisible();
        await page
          .locator('input[name="password"]')
          .fill(password);
        await page.waitForTimeout(3500);
      }
    );

    await allure.step("Click on sign in button", async () => {
      const signInButton = page.locator('button[type="submit"]');
      await expect(signInButton).toBeEnabled();
      await signInButton.click();
      await page.waitForTimeout(3500);
    });
  });

export const clickSelectConnectionType = (page: Page) =>
  test.step('Click "Select connection type..."', async () => {
    await allure.step(
      'Locate and click "Select connection type..." text',
      async () => {
        const el = page.getByText("Select connection type...");
        await expect(el).toBeVisible();
        await el.click();
      }
    );
  });

export const clickProductionOption = (page: Page) =>
  test.step('Click "Production" option', async () => {
    await allure.step('Locate and click "Production" text', async () => {
      const el = page.getByText("Production");
      await expect(el).toBeVisible();
      await el.click();
    });
  });

// AWT Environment (commented out for edit client tests - used in other scripts)
// export const loginAliquotAwt = (page: Page, email: string, password: string) =>
//   test.step("Login as user", async () => {
//     await allure.step("Check email field visibility and fill it", async () => {
//       const input = page.getByPlaceholder("user@example.com");
//       await expect(input).toBeVisible();
//       await input.fill(email);
//     });

//     await allure.step(
//       "Check password field visibility and fill it",
//       async () => {
//         const input = page.getByPlaceholder("*********");
//         await expect(input).toBeVisible();
//         await input.fill(password);
//         await page.waitForTimeout(3500);
//       }
//     );

//     await allure.step("Click on sign in button", async () => {
//       const btn = page.getByRole("button", { name: "Login to Account" });
//       await expect(btn).toBeVisible();
//       await btn.click();
//       await page.waitForTimeout(3500);
//     });
//   });

// QA Environment (for edit client tests)
export const loginAliquotQa = (page: Page, email: string, password: string) =>
  test.step("Login as user", async () => {
    await allure.step("Check email field visibility and fill it", async () => {
      const input = page.getByPlaceholder("user@example.com");
      await expect(input).toBeVisible();
      await input.fill(email);
    });

    await allure.step(
      "Check password field visibility and fill it",
      async () => {
        const input = page.getByPlaceholder("*********");
        await expect(input).toBeVisible();
        await input.fill(password);
        await page.waitForTimeout(3500);
      }
    );

    await allure.step("Click on sign in button", async () => {
      const btn = page.getByRole("button", { name: "Login to Account" });
      await expect(btn).toBeVisible();
      await btn.click();
      await page.waitForTimeout(3500);
    });
  });

export const loginAquaUser = (page: Page, email: string, password: string) =>
  test.step("Login as user", async () => {
    await allure.step("Check email field visibility and fill it", async () => {
      const input = page.getByPlaceholder("user@example.com").or(
        page.getByPlaceholder("Email").or(
          page.getByPlaceholder("email").or(
            page.getByRole("textbox", { name: /email/i }).or(
              page.locator('input[type="email"]').or(
                page.locator('input[name*="email"]').or(
                  page.locator('input[name*="username"]').or(
                    page.locator('input[name*="user"]')
                  )
                )
              )
            )
          )
        )
      );
      await expect(input).toBeVisible();
      await input.fill(email);
      await page.waitForTimeout(1500);
    });

    await allure.step(
      "Check password field visibility and fill it",
      async () => {
        const input = page.getByPlaceholder("*********").or(
          page.getByPlaceholder("Password").or(
            page.getByPlaceholder("password").or(
              page.getByRole("textbox", { name: /password/i }).or(
                page.locator('input[type="password"]').or(
                  page.locator('input[name*="password"]').or(
                    page.locator('input[name*="pass"]')
                  )
                )
              )
            )
          )
        );
        await expect(input).toBeVisible();
        await input.fill(password);
        await page.waitForTimeout(1500);
      }
    );

    await allure.step("Click on sign in button", async () => {
      const btn = page.getByRole("button", { name: "Login" }).or(
        page.getByRole("button", { name: /login/i }).or(
          page.getByRole("button", { name: "Sign In" }).or(
            page.getByRole("button", { name: /sign in/i }).or(
              page.locator('button[type="submit"]').or(
                page.locator('input[type="submit"]')
              )
            )
          )
        )
      );
      await expect(btn).toBeVisible();
      await btn.click();
      await page.waitForTimeout(3500);
    });
  });

export const verifyAquaLogin = (page: Page) =>
  test.step("Verify login", async () => {
    await allure.step("Verify Homepage", async () => {
      const searchBox = page.getByRole("searchbox", {
        name: "Search for accounts...",
      });
      await expect(searchBox).toBeVisible();
    });
  });

// AWT Environment (DEPRECATED - No longer available)
// export const verifyAquaLoginAWT = (page: Page) =>
//   test.step("Verify login", async () => {
//     await allure.step("Verify Homepage", async () => {
//       const dashboardBtn = page.getByRole("button", { name: "Dashboard" });
//       await expect(dashboardBtn).toBeVisible();
//     });
//   });

// QA Environment (PRIMARY - All tests should use this environment)
export const verifyAquaLoginQa = (page: Page) =>
  test.step("Verify login", async () => {
    await allure.step("Verify Homepage", async () => {
      // Check for elements that indicate successful login (not login page)
      try {
        // First try the searchbox approach (like regular verifyAquaLogin)
        const searchBox = page.getByRole("searchbox", {
          name: "Search for accounts...",
        });
        await expect(searchBox).toBeVisible();
      } catch {
        try {
          // Fallback to Dashboard button (like AWT environment)
          const dashboardBtn = page.getByRole("button", { name: "Dashboard" });
          await expect(dashboardBtn).toBeVisible();
        } catch {
          // Final fallback - check for any search input or navigation element
          const anySearchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
          await expect(anySearchInput).toBeVisible();
        }
      }
      });
  });

export const verifyAquaLoginErrorMsg = (page: Page) =>
  test.step("Verify login error", async () => {
    await allure.step("Verify login error", async () => {
      const eleErr = page.getByText("The username and password you");
      await expect(eleErr).toBeVisible();
    });
  });

export async function toLogin(page: Page): Promise<boolean> {
  const el = page.getByPlaceholder("user@example.com");
  const searchBox = page.getByRole("button", { name: "Dashboard" });
  try {
    await waitForSec(5000);
    await expect(el).toBeVisible();
    return (el.isVisible() && searchBox.isHidden());
  } catch {
    return false;
  }
}
