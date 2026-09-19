// helpers/actions/base.action.ts

import { expect, Locator, Page } from '@playwright/test'
// import { LocatorFactory, LocatorSpec } from '../locators'

export abstract class BaseAction {
  /**
   * Default timeout in milliseconds.
   */
  protected readonly defaultTimeout = 30_000

  constructor(protected readonly page: Page) {}

  // /**
  //  * Resolves the supplied LocatorSpec into a Playwright Locator.
  //  *
  //  * @param locator Locator specification.
  //  *
  //  * @returns Resolved Playwright Locator.
  //  */
  // protected async resolveLocator(locator: LocatorSpec): Promise<Locator> {
  //   return await LocatorFactory.resolve(this.page, locator)
  // }

  /**
   * Resolves the locator, waits until it becomes visible,
   * scrolls it into view and highlights it before interaction.
   *
   * This method should be called before performing any UI action.
   *
   * @param locator Locator specification.
   * @param timeout Maximum wait time for element visibility.
   *
   * @returns Resolved Playwright Locator.
   */
  protected async prepare(
    locator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<Locator> {
    // Wait until the element becomes visible.
    await expect(locator).toBeVisible({ timeout })

    // Ensure the element is within the visible viewport.
    await locator.scrollIntoViewIfNeeded()

    // Highlight the element for debugging purposes.
    await this.highlight(locator)

    // Return the resolved locator for further interaction.
    return locator
  }

  /**
   * Highlights an element.
   * Disable this method if highlighting is not required.
   */
  protected async highlight(locator: Locator): Promise<void> {
    await locator.evaluate((element: HTMLElement) => {
      const originalOutline = element.style.outline

      element.style.outline = '2px solid red'

      requestAnimationFrame(() => {
        element.style.outline = originalOutline
      })
    })
  }
}
