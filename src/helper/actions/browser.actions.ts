import { Page } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Supported Playwright page load states.
 */
type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle'

/**
 * Provides reusable browser and page navigation methods.
 */
export class BrowserActions extends BaseAction {
  /**
   * Initializes the BrowserActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigates to the specified URL.
   *
   * @param url Application URL.
   * @param waitUntil Page load state.
   *
   * @returns Promise<void>
   */
  @Step(`Navigate to application`)
  async navigate(url: string, waitUntil: WaitUntil = 'load'): Promise<void> {
    await this.page.goto(url, {
      waitUntil,
    })
  }

  /**
   * Reloads the current page.
   *
   * @param waitUntil Page load state.
   *
   * @returns Promise<void>
   */
  @Step(`Reload current page`)
  async reload(waitUntil: WaitUntil = 'load'): Promise<void> {
    await this.page.reload({
      waitUntil,
    })
  }

  /**
   * Navigates back to the previous page.
   *
   * @param waitUntil Page load state.
   *
   * @returns Promise<void>
   */
  @Step(`Navigate back`)
  async goBack(waitUntil: WaitUntil = 'load'): Promise<void> {
    await this.page.goBack({
      waitUntil,
    })
  }

  /**
   * Navigates forward.
   *
   * @param waitUntil Page load state.
   *
   * @returns Promise<void>
   */
  @Step(`Navigate forward`)
  async goForward(waitUntil: WaitUntil = 'load'): Promise<void> {
    await this.page.goForward({
      waitUntil,
    })
  }

  /**
   * Returns the current page URL.
   *
   * @returns Current URL.
   */
  @Step(`Get current URL`)
  async getCurrentUrl(): Promise<string> {
    return this.page.url()
  }

  /**
   * Returns the current page title.
   *
   * @returns Page title.
   */
  @Step(`Get page title`)
  async getTitle(): Promise<string> {
    return await this.page.title()
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
   * Waits until all network requests become idle.
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
   * Determines whether the page is fully loaded.
   *
   * @returns True if page is loaded.
   */
  @Step(`Check whether page is loaded`)
  async isPageLoaded(): Promise<boolean> {
    return await this.page.evaluate(() => document.readyState === 'complete')
  }

  /**
   * Reloads the page until the supplied condition returns true.
   *
   * @param condition Callback function.
   * @param retries Maximum retries.
   * @param delay Delay between retries in milliseconds.
   *
   * @returns Promise<void>
   */
  @Step(`Refresh page until condition is satisfied`)
  async refreshUntil(
    condition: () => Promise<boolean>,
    retries: number = 5,
    delay: number = 1000,
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      if (await condition()) {
        return
      }

      await this.reload()

      await this.page.waitForTimeout(delay)
    }

    throw new Error(`Condition was not satisfied after ${retries} retries.`)
  }

  /**
   * Opens a new browser tab.
   *
   * @returns Newly opened page.
   */
  @Step(`Open new browser tab`)
  async openNewTab(): Promise<Page> {
    const newPage = await this.page.context().newPage()

    return newPage
  }

  /**
   * Returns all open browser tabs.
   *
   * @returns Collection of pages.
   */
  @Step(`Get all browser tabs`)
  async getAllTabs(): Promise<Page[]> {
    return this.page.context().pages()
  }

  /**
   * Returns the total number of open browser tabs.
   *
   * @returns Number of tabs.
   */
  @Step(`Get browser tab count`)
  async getTabCount(): Promise<number> {
    return this.page.context().pages().length
  }

  /**
   * Switches to the specified browser tab.
   *
   * @param index Zero-based tab index.
   *
   * @returns Selected page.
   */
  @Step(`Switch browser tab`)
  async switchToTab(index: number): Promise<Page> {
    const pages = this.page.context().pages()

    if (index < 0 || index >= pages.length) {
      throw new Error(`Tab index '${index}' is out of range.`)
    }

    await pages[index].bringToFront()

    return pages[index]
  }

  /**
   * Closes the current browser tab.
   *
   * @returns Promise<void>
   */
  @Step(`Close current browser tab`)
  async closeCurrentTab(): Promise<void> {
    await this.page.close()
  }

  /**
   * Closes every browser tab except the current one.
   *
   * @returns Promise<void>
   */
  @Step(`Close other browser tabs`)
  async closeOtherTabs(): Promise<void> {
    const pages = this.page.context().pages()

    for (const page of pages) {
      if (page !== this.page) {
        await page.close()
      }
    }
  }

  /**
   * Clears all browser cookies.
   *
   * @returns Promise<void>
   */
  @Step(`Clear browser cookies`)
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies()
  }

  /**
   * Clears Local Storage.
   *
   * @returns Promise<void>
   */
  @Step(`Clear local storage`)
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => {
      window.localStorage.clear()
    })
  }

  /**
   * Clears Session Storage.
   *
   * @returns Promise<void>
   */
  @Step(`Clear session storage`)
  async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => {
      window.sessionStorage.clear()
    })
  }

  /**
   * Sets the browser viewport size.
   *
   * @param width Browser width.
   * @param height Browser height.
   *
   * @returns Promise<void>
   */
  @Step(`Set browser viewport`)
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({
      width,
      height,
    })
  }

  /**
   * Returns the current viewport size.
   *
   * @returns Viewport dimensions.
   */
  @Step(`Get browser viewport`)
  async getViewportSize(): Promise<{
    width: number
    height: number
  } | null> {
    return this.page.viewportSize()
  }
}
