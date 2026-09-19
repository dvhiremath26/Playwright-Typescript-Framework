import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides common page interaction methods.
 */
export class CommonActions extends BaseAction {
  /**
   * Initializes the CommonActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Clicks on the specified locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Click on element`)
  async click(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.click()
  }

  /**
   * Double-clicks on the specified locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Double click on element`)
  async doubleClick(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.dblclick()
  }

  /**
   * Performs right-click on the specified locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Right click on element`)
  async rightClick(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.click({
      button: 'right',
    })
  }

  /**
   * Hovers over the specified locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Hover over on element`)
  async hover(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.hover()
  }

  /**
   * Focuses the specified locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Focus the element`)
  async focus(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
    await element.focus()
  }

  /**
   * Scrolls the specified locator into the viewport.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Promise<void>
   */
  @Step(`Scroll into the element`)
  async scrollIntoView(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)
  }

  /**
   * Retrieves text content from the locator.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Text content.
   */
  @Step(`Get text from the element`)
  async getText(locator: Locator, timeout: number = this.defaultTimeout): Promise<string> {
    const element = await this.prepare(locator, timeout)
    return (await element.textContent())?.trim() ?? ''
  }

  /**
   * Retrieves the specified attribute value.
   *
   * @param locator Target locator.
   * @param attributeName Attribute name.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Attribute value or null.
   */
  @Step(`Get attribute value from the element`)
  async getAttribute(
    locator: Locator,
    attributeName: string,
    timeout: number = this.defaultTimeout,
  ): Promise<string | null> {
    const element = await this.prepare(locator, timeout)
    return await element.getAttribute(attributeName)
  }

  /**
   * Determines whether the locator is visible.
   *
   * @param locator Target locator.
   *
   * @returns True if visible; otherwise false.
   */
  @Step(`Check if the  element visible`)
  async isVisible(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)

    return await element.isVisible()
  }

  /**
   * Determines whether the locator is enabled.
   *
   * @param locator Target locator.
   *
   * @returns True if enabled; otherwise false.
   */
  @Step(`Check if element is enabled`)
  async isEnabled(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)
    return await element.isEnabled()
  }

  /**
   * Determines whether the locator is editable.
   *
   * @param locator Target locator.
   *
   * @returns True if editable; otherwise false.
   */
  @Step(`Check if element is editable`)
  async isEditable(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)
    return await element.isEditable()
  }

  /**
   * Determines whether the locator is disabled.
   *
   * @param locator Target locator.
   *
   * @returns True if disabled; otherwise false.
   */
  @Step(`Check if element is disabled`)
  async isDisabled(locator: Locator, timeout: number = this.defaultTimeout): Promise<boolean> {
    const element = await this.prepare(locator, timeout)
    return await element.isDisabled()
  }

  /**
   * Retrieves the inner HTML.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Inner HTML.
   */
  @Step(`Get the inner html of the element`)
  async getInnerHtml(locator: Locator, timeout: number = this.defaultTimeout): Promise<string> {
    const element = await this.prepare(locator, timeout)
    return await element.innerHTML()
  }

  /**
   * Retrieves the inner text.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Inner text.
   */
  @Step(`Get the inner text of the element`)
  async getInnerText(locator: Locator, timeout: number = this.defaultTimeout): Promise<string> {
    const element = await this.prepare(locator, timeout)
    return await element.innerText()
  }
}
