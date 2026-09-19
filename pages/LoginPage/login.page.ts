import { Page } from '@playwright/test'
import { BasePage } from '../Base/base.page'
import { LoginLocators } from './login.locators'
import { Step } from '@src/helper/decorators'
import { HomePage } from '../HomePage/home.page'

export class LoginPage extends BasePage {

  readonly locators: LoginLocators

  constructor(page: Page) {
    super(page)
    this.locators = new LoginLocators(page)
  }

  async navigateLoginPage(): Promise<void> {
    await this.actions.browser.navigate(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    )
  }

  @Step(`Enter username - "{0}"`)
  async enterUsername(username: string): Promise<void> {
    await this.actions.textbox.fill(this.locators.USERNAME, username)
  }

  @Step()
  async enterPassword(password: string): Promise<void> {
    await this.actions.textbox.fill(this.locators.PASSWORD, password)
  }

  @Step(`Click on Login button`)
  async clickOnLoginButton(): Promise<HomePage> {
    await this.actions.page.click(this.locators.LOGIN_BUTTON)
    return new HomePage(this.page)
  }
}
