import { Page, Locator } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected getById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  protected getByClass(className: string): Locator {
    return this.page.locator(`.${className}`);
  }

  protected async waitForHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "hidden" });
  }

  protected async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
  }
}
