import { expect, Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable assertion methods.
 */
export class ValidationActions extends BaseAction {
  /**
   * Initializes the ValidationActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Verifies that the element is visible.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is visible`)
  async expectVisible(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeVisible({
      timeout,
    })
  }

  /**
   * Verifies that the element is hidden.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is hidden`)
  async expectHidden(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeHidden({
      timeout,
    })
  }

  /**
   * Verifies that the element is enabled.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is enabled`)
  async expectEnabled(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeEnabled({
      timeout,
    })
  }

  /**
   * Verifies that the element is disabled.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is disabled`)
  async expectDisabled(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeDisabled({
      timeout,
    })
  }

  /**
   * Verifies that the element is editable.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is editable`)
  async expectEditable(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeEditable({
      timeout,
    })
  }

  /**
   * Verifies that the checkbox is checked.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify checkbox is checked`)
  async expectChecked(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeChecked({
      timeout,
    })
  }

  /**
   * Verifies that the checkbox is unchecked.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify checkbox is unchecked`)
  async expectUnchecked(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).not.toBeChecked({
      timeout,
    })
  }

  /**
   * Verifies that the element has focus.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element has focus`)
  async expectFocused(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeFocused({
      timeout,
    })
  }

  /**
   * Verifies that the element text exactly matches the expected text.
   *
   * @param locator Target locator.
   * @param expectedText Expected text.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element text`)
  async expectText(
    locator: Locator,
    expectedText: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveText(expectedText, {
      timeout,
    })
  }

  /**
   * Verifies that the element contains the expected text.
   *
   * @param locator Target locator.
   * @param expectedText Expected text.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element contains text`)
  async expectContainsText(
    locator: Locator,
    expectedText: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toContainText(expectedText, {
      timeout,
    })
  }

  /**
   * Verifies the value of an input element.
   *
   * @param locator Target locator.
   * @param expectedValue Expected value.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element value`)
  async expectValue(
    locator: Locator,
    expectedValue: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveValue(expectedValue, {
      timeout,
    })
  }

  /**
   * Verifies the element count.
   *
   * @param locator Target locator.
   * @param expectedCount Expected count.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element count`)
  async expectCount(
    locator: Locator,
    expectedCount: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveCount(expectedCount, {
      timeout,
    })
  }

  /**
   * Verifies the specified attribute value.
   *
   * @param locator Target locator.
   * @param attributeName Attribute name.
   * @param expectedValue Expected attribute value.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element attribute`)
  async expectAttribute(
    locator: Locator,
    attributeName: string,
    expectedValue: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveAttribute(attributeName, expectedValue, {
      timeout,
    })
  }

  /**
   * Verifies the CSS property value.
   *
   * @param locator Target locator.
   * @param propertyName CSS property.
   * @param expectedValue Expected value.
   *
   * @returns Promise<void>
   */
  @Step(`Verify CSS property`)
  async expectCss(
    locator: Locator,
    propertyName: string,
    expectedValue: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveCSS(propertyName, expectedValue)
  }

  /**
   * Verifies the page URL.
   *
   * @param expectedUrl Expected URL or RegExp.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify page URL`)
  async expectUrl(
    expectedUrl: string | RegExp,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, {
      timeout,
    })
  }

  /**
   * Verifies the page title.
   *
   * @param expectedTitle Expected title or RegExp.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify page title`)
  async expectTitle(
    expectedTitle: string | RegExp,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, {
      timeout,
    })
  }

  /**
   * Verifies that the element is empty.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is empty`)
  async expectEmpty(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeEmpty({
      timeout,
    })
  }

  /**
   * Verifies that the element is attached to the DOM.
   *
   * @param locator Target locator.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is attached`)
  async expectAttached(locator: Locator): Promise<void> {
    const element = await this.prepare(locator)

    await expect(element).toBeAttached()
  }

  /**
   * Verifies that the element is in the viewport.
   *
   * @param locator Target locator.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element is in viewport`)
  async expectInViewport(locator: Locator): Promise<void> {
    const element = await this.prepare(locator)

    await expect(element).toBeInViewport()
  }

  /**
   * Verifies the element screenshot.
   *
   * @param locator Target locator.
   * @param fileName Screenshot file name.
   *
   * @returns Promise<void>
   */
  @Step(`Verify element screenshot`)
  async expectScreenshot(locator: Locator, fileName: string): Promise<void> {
    const element = await this.prepare(locator)

    await expect(element).toHaveScreenshot(fileName)
  }
}
