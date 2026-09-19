import { Page } from '@playwright/test'
import { BasePage } from '../Base/base.page'
import { HomePageLocators } from './home.locators'

export class HomePage extends BasePage {
  readonly locators: HomePageLocators
  constructor(page: Page) {
    super(page)
    this.locators = new HomePageLocators(page)
  }

  async clickOnLogoutButton(): Promise<void> {}
}
