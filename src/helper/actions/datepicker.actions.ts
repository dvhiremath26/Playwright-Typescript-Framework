import { Locator, Page } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable date picker interaction methods.
 */
export class DatePickerActions extends BaseAction {
  /**
   * Initializes the DatePickerActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Sets a date by filling the input.
   *
   * @param locator Target date picker locator.
   * @param value Date value.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Set date`)
  async setDate(
    locator: Locator,
    value: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.fill(value)
  }

  /**
   * Clears the date picker.
   *
   * @param locator Target date picker locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Clear date`)
  async clearDate(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.clear()
  }

  /**
   * Returns the selected date.
   *
   * @param locator Target date picker locator.
   * @param timeout Maximum wait time.
   *
   * @returns Selected date.
   */
  @Step(`Get selected date`)
  async getDate(locator: Locator, timeout: number = this.defaultTimeout): Promise<string> {
    const element = await this.prepare(locator, timeout)

    return await element.inputValue()
  }

  /**
   * Opens the date picker.
   *
   * @param locator Target date picker locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Open date picker`)
  async open(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.click()
  }

  /**
   * Closes the date picker.
   *
   * @param locator Target date picker locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Close date picker`)
  async close(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.press('Escape')
  }

  /**
   * Sets today's date.
   *
   * @param locator Target date picker locator.
   * @param format Date format.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Set current date`)
  async setCurrentDate(
    locator: Locator,
    format: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const today = new Date().toLocaleDateString('en-CA', format)

    await this.setDate(locator, today, timeout)
  }

  /**
   * Checks whether the date picker is empty.
   *
   * @param locator Target date picker locator.
   *
   * @returns True if empty.
   */
  @Step(`Check whether date picker is empty`)
  async isEmpty(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)

    return (await element.inputValue()).trim() === ''
  }

  /**
   * Checks whether the date picker is read-only.
   *
   * @param locator Target date picker locator.
   *
   * @returns True if read-only.
   */
  @Step(`Check whether date picker is readonly`)
  async isReadOnly(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)

    return await element.evaluate((element) => (element as HTMLInputElement).readOnly)
  }
}
