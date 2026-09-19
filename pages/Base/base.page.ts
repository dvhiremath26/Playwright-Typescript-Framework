import { Page } from '@playwright/test'
import { Actions } from '@src/helper/actions/actions'

export abstract class BasePage {
  protected readonly actions: Actions

  constructor(protected readonly page: Page) {
    this.actions = new Actions(page)
  }
}
