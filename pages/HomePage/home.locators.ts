// import { By, locator } from '@src/helper/locators'
import { Page } from '@playwright/test'

export class HomePageLocators {
  constructor(private readonly page: Page) {}

  readonly LOGOUT_BUTTON = this.page.locator('button[aria-label="Logout"]')
}
