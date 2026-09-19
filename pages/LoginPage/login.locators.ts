import { Page } from '@playwright/test'

export class LoginLocators {
  constructor(private readonly page: Page) {}

  readonly USERNAME = this.page.getByPlaceholder('Username')
  readonly PASSWORD = this.page.getByRole('textbox', { name: 'Password' })
  readonly LOGIN_BUTTON = this.page.getByRole('button', { name: 'Login' })
}
