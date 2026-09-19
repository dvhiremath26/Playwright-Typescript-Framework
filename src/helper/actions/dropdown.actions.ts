import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable dropdown interaction methods.
 *
 * Supports native HTML <select> elements.
 * Custom SAP/Fiori dropdowns will be handled with dedicated overloaded methods later.
 */
export class DropdownActions extends BaseAction {
  /**
   * Initializes the DropdownActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Selects an option by visible text.
   *
   * @param locator Target dropdown locator.
   * @param text Visible text to select.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Select dropdown option by text`)
  async selectByText(
    locator: Locator,
    text: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.selectOption({ label: text })
  }

  /**
   * Selects an option by value.
   *
   * @param locator Target dropdown locator.
   * @param value Option value.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Select dropdown option by value`)
  async selectByValue(
    locator: Locator,
    value: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.selectOption({ value })
  }

  /**
   * Selects an option by index.
   *
   * @param locator Target dropdown locator.
   * @param index Option index.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Select dropdown option by index`)
  async selectByIndex(
    locator: Locator,
    index: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.selectOption({ index })
  }

  /**
   * Retrieves the selected option text.
   *
   * @param locator Target dropdown locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Selected option text.
   */
  @Step(`Get selected dropdown option`)
  async getSelectedText(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string> {
    const element = await this.prepare(locator, timeout)

    return await element.evaluate((element) => {
      const select = element as HTMLSelectElement
      return select.options[select.selectedIndex]?.text ?? ''
    })
  }

  /**
   * Retrieves the selected option value.
   *
   * @param locator Target dropdown locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Selected option value.
   */
  @Step(`Get selected dropdown value`)
  async getSelectedValue(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string> {
    const element = await this.prepare(locator, timeout)

    return await element.inputValue()
  }

  /**
   * Retrieves all available dropdown options.
   *
   * @param locator Target dropdown locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns List of dropdown option texts.
   */
  @Step(`Get all dropdown options`)
  async getAllOptions(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<string[]> {
    const element = await this.prepare(locator, timeout)

    return await element.evaluate((element) => {
      const select = element as HTMLSelectElement

      return Array.from(select.options).map((option) => option.text.trim())
    })
  }

  /**
   * Retrieves the total number of options.
   *
   * @param locator Target dropdown locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Total option count.
   */
  @Step(`Get dropdown option count`)
  async getOptionCount(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<number> {
    const element = await this.prepare(locator, timeout)

    return await element.evaluate((element) => {
      return (element as HTMLSelectElement).options.length
    })
  }

  /**
   * Determines whether the dropdown supports multiple selection.
   *
   * @param locator Target dropdown locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns True if multiple selection is supported.
   */
  @Step(`Check whether dropdown supports multiple selection`)
  async isMultiple(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)

    return await element.evaluate((element) => {
      return (element as HTMLSelectElement).multiple
    })
  }
}
