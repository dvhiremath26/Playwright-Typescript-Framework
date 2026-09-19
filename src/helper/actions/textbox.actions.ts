import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable textbox interaction methods.
 */
export class TextboxActions extends BaseAction {
  /**
   * Initializes the TextboxActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Clears the existing value and enters the specified text.
   *
   * @param locator Target textbox locator.
   * @param value Value to be entered.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Enter text into textbox`)
  async fill(
    locator: Locator,
    value: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.fill(value)
  }

  /**
   * Types text into the textbox without clearing existing value.
   *
   * @param locator Target textbox locator.
   * @param value Value to be typed.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Type text into textbox`)
  async type(
    locator: Locator,
    value: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.pressSequentially(value)
  }

  /**
   * Appends text to the existing textbox value.
   *
   * @param locator Target textbox locator.
   * @param value Value to append.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Append text into textbox`)
  async append(
    locator: Locator,
    value: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.pressSequentially(value)
  }

  /**
   * Clears the textbox value.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Clear textbox`)
  async clear(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.clear()
  }

  /**
   * Retrieves the textbox value.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Textbox value.
   */
  @Step(`Get textbox value`)
  async getValue(locator: Locator, timeout: number = this.defaultTimeout): Promise<string> {
    const element = await this.prepare(locator, timeout)
    return await element.inputValue()
  }

  /**
   * Retrieves the textbox placeholder.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Placeholder text.
   */
  @Step(`Get textbox placeholder`)
  async getPlaceholder(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string | null> {
    const element = await this.prepare(locator, timeout)
    return await element.getAttribute('placeholder')
  }

  /**
   * Retrieves the textbox maxlength attribute.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Max length value.
   */
  @Step(`Get textbox maximum length`)
  async getMaxLength(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string | null> {
    const element = await this.prepare(locator, timeout)
    return await element.getAttribute('maxlength')
  }

  /**
   * Retrieves the textbox minimum length attribute.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Minimum length value.
   */
  @Step(`Get textbox minimum length`)
  async getMinLength(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string | null> {
    const element = await this.prepare(locator, timeout)
    return await element.getAttribute('minlength')
  }

  /**
   * Presses Enter inside the textbox.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Press Enter in textbox`)
  async pressEnter(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.press('Enter')
  }

  /**
   * Presses Tab inside the textbox.
   *
   * @param locator Target textbox locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Press Tab in textbox`)
  async pressTab(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.press('Tab')
  }
}
