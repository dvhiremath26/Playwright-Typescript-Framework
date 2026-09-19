import { FrameLocator, Page, Locator } from '@playwright/test'
import { Step } from '@src/helper/decorators'
import { BaseAction } from './base.actions'

/**
 * Provides reusable iframe interaction methods.
 */
export class FrameActions extends BaseAction {
  /**
   * Initializes the FrameActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Returns a FrameLocator using the frame locator.
   *
   * @param locator Frame locator.
   *
   * @returns FrameLocator.
   */
  @Step(`Get frame locator`)
  async getFrame(locator: Locator): Promise<FrameLocator> {
    return locator.contentFrame()
  }

  /**
   * Returns a FrameLocator using CSS selector.
   *
   * @param selector Frame selector.
   *
   * @returns FrameLocator.
   */
  @Step(`Get frame using selector`)
  async getFrameBySelector(selector: string): Promise<FrameLocator> {
    return this.page.frameLocator(selector)
  }

  /**
   * Returns a FrameLocator using frame name.
   *
   * @param name Frame name.
   *
   * @returns FrameLocator.
   */
  @Step(`Get frame using name`)
  async getFrameByName(name: string): Promise<FrameLocator> {
    return this.page.frameLocator(`iframe[name="${name}"]`)
  }

  /**
   * Returns a FrameLocator using frame title.
   *
   * @param title Frame title.
   *
   * @returns FrameLocator.
   */
  @Step(`Get frame using title`)
  async getFrameByTitle(title: string): Promise<FrameLocator> {
    return this.page.frameLocator(`iframe[title="${title}"]`)
  }

  /**
   * Returns a FrameLocator using frame index.
   *
   * @param index Zero-based frame index.
   *
   * @returns FrameLocator.
   */
  @Step(`Get frame using index`)
  async getFrameByIndex(index: number): Promise<FrameLocator> {
    return this.page.locator('iframe').nth(index).contentFrame()
  }

  /**
   * Returns total number of iframes.
   *
   * @returns Frame count.
   */
  @Step(`Get frame count`)
  async getFrameCount(): Promise<number> {
    return this.page.frames().length
  }

  /**
   * Determines whether the specified frame exists.
   *
   * @param selector Frame selector.
   *
   * @returns True if frame exists.
   */
  @Step(`Check whether frame exists`)
  async exists(selector: string): Promise<boolean> {
    return (await this.page.locator(selector).count()) > 0
  }
}
