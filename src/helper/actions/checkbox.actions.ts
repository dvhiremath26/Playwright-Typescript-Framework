import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable checkbox interaction methods.
 */
export class CheckboxActions extends BaseAction {
  /**
   * Initializes the CheckboxActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Checks the checkbox if it is not already checked.
   *
   * @param locator Target checkbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Check the checkbox`)
  async check(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.check()
  }

  /**
   * Unchecks the checkbox if it is checked.
   *
   * @param locator Target checkbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Uncheck the checkbox`)
  async uncheck(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.uncheck()
  }

  /**
   * Toggles the checkbox state.
   *
   * @param locator Target checkbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Toggle the checkbox`)
  async toggle(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    if (await element.isChecked()) {
      await element.uncheck()
    } else {
      await element.check()
    }
  }

  /**
   * Determines whether the checkbox is checked.
   *
   * @param locator Target checkbox locator.
   *
   * @returns True if checked; otherwise false.
   */
  @Step(`Check whether checkbox is checked`)
  async isChecked(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)
    return await element.isChecked()
  }

  /**
   * Determines whether the checkbox is unchecked.
   *
   * @param locator Target checkbox locator.
   *
   * @returns True if unchecked; otherwise false.
   */
  @Step(`Check whether checkbox is unchecked`)
  async isUnchecked(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)
    return !(await element.isChecked())
  }
}
