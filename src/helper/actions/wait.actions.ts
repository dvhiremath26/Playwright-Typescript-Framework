import { Page, Response, Request, Download, expect, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Supported Playwright page load states.
 */
type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle'

/**
 * Provides reusable wait and synchronization methods.
 */
export class WaitActions extends BaseAction {
  /**
   * Initializes the WaitActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Waits until the page reaches the specified load state.
   *
   * @param state Page load state.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for page load`)
  async waitForPageLoad(
    state: WaitUntil = 'load',
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await this.page.waitForLoadState(state, {
      timeout,
    })
  }

  /**
   * Waits until the network becomes idle.
   *
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for network idle`)
  async waitForNetworkIdle(timeout: number = this.defaultTimeout): Promise<void> {
    await this.page.waitForLoadState('networkidle', {
      timeout,
    })
  }

  /**
   * Waits until the locator becomes visible.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for element to become visible`)
  async waitForElementVisible(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.waitFor({
      state: 'visible',
      timeout,
    })
  }

  /**
   * Waits until the locator becomes hidden.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for element to become hidden`)
  async waitForElementHidden(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.waitFor({
      state: 'hidden',
      timeout,
    })
  }

  /**
   * Waits until the locator is attached.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for element to be attached`)
  async waitForElementAttached(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.waitFor({
      state: 'attached',
      timeout,
    })
  }

  /**
   * Waits until the locator is detached.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for element to be detached`)
  async waitForElementDetached(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.waitFor({
      state: 'detached',
      timeout,
    })
  }

  /**
   * Waits until the page URL matches.
   *
   * @param url Expected URL or RegExp.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for URL`)
  async waitForUrl(url: string | RegExp, timeout: number = this.defaultTimeout): Promise<void> {
    await this.page.waitForURL(url, {
      timeout,
    })
  }

  /**
   * Waits until the page title matches.
   *
   * @param title Expected title or RegExp.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for page title`)
  async waitForTitle(title: string | RegExp, timeout: number = this.defaultTimeout): Promise<void> {
    await this.page.waitForFunction(
      (expected) =>
        expected instanceof RegExp ? expected.test(document.title) : document.title === expected,
      title,
      { timeout },
    )
  }

  /**
   * Waits for a network response.
   *
   * @param url URL or predicate.
   * @param timeout Maximum wait time.
   *
   * @returns Response.
   */
  @Step(`Wait for response`)
  async waitForResponse(
    url: string | RegExp | ((response: Response) => boolean | Promise<boolean>),
    timeout: number = this.defaultTimeout,
  ): Promise<Response> {
    return await this.page.waitForResponse(url as never, {
      timeout,
    })
  }

  /**
   * Waits for a network request.
   *
   * @param url URL or predicate.
   * @param timeout Maximum wait time.
   *
   * @returns Request.
   */
  @Step(`Wait for request`)
  async waitForRequest(
    url: string | RegExp | ((request: Request) => boolean | Promise<boolean>),
    timeout: number = this.defaultTimeout,
  ): Promise<Request> {
    return await this.page.waitForRequest(url as never, {
      timeout,
    })
  }

  /**
   * Waits for a file download.
   *
   * @param timeout Maximum wait time.
   *
   * @returns Download.
   */
  @Step(`Wait for file download`)
  async waitForDownload(timeout: number = this.defaultTimeout): Promise<Download> {
    return await this.page.waitForEvent('download', {
      timeout,
    })
  }

  /**
   * Waits for a popup window.
   *
   * @param timeout Maximum wait time.
   *
   * @returns Popup page.
   */
  @Step(`Wait for popup window`)
  async waitForPopup(timeout: number = this.defaultTimeout): Promise<Page> {
    return await this.page.waitForEvent('popup', {
      timeout,
    })
  }

  /**
   * Waits for a newly opened browser tab.
   *
   * @param timeout Maximum wait time.
   *
   * @returns New page.
   */
  @Step(`Wait for new browser tab`)
  async waitForNewTab(timeout: number = this.defaultTimeout): Promise<Page> {
    return await this.page.context().waitForEvent('page', {
      timeout,
    })
  }

  /**
   * Waits until the supplied function returns true.
   *
   * @param pageFunction Function executed in browser context.
   * @param arg Optional argument passed to the function.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for custom condition`)
  async waitForFunction(
    pageFunction: Parameters<Page['waitForFunction']>[0],
    arg?: Parameters<Page['waitForFunction']>[1],
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await this.page.waitForFunction(pageFunction, arg, {
      timeout,
    })
  }

  /**
   * Explicit wait.
   *
   * Use only when absolutely necessary.
   *
   * @param milliseconds Wait duration.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for timeout`)
  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds)
  }

  /**
   * Waits until the element becomes enabled.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element is enabled`)
  async waitUntilEnabled(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeEnabled({
      timeout,
    })
  }

  /**
   * Waits until the element becomes disabled.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element is disabled`)
  async waitUntilDisabled(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeDisabled({
      timeout,
    })
  }

  /**
   * Waits until the element becomes editable.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element is editable`)
  async waitUntilEditable(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toBeEditable({
      timeout,
    })
  }

  /**
   * Waits until the element contains the expected text.
   *
   * @param locator Target locator.
   * @param expectedText Expected text.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element contains text`)
  async waitUntilText(
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
   * Waits until the element has the expected value.
   *
   * @param locator Target locator.
   * @param expectedValue Expected value.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element contains value`)
  async waitUntilValue(
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
   * Waits until the element count matches the expected count.
   *
   * @param locator Target locator.
   * @param expectedCount Expected count.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait until element count matches`)
  async waitUntilCount(
    locator: Locator,
    expectedCount: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await expect(element).toHaveCount(expectedCount, {
      timeout,
    })
  }
}
