import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable mouse interaction methods.
 */
export class MouseActions extends BaseAction {
  /**
   * Initializes the MouseActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Moves the mouse over the specified element.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Move mouse over element`)
  async moveTo(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.hover()
  }

  /**
   * Performs a right mouse click.
   *
   * @param locator Target locator.
   * @param timeout Maximum wait time.
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
   * Performs mouse down.
   *
   * @returns Promise<void>
   */
  @Step(`Mouse down`)
  async mouseDown(): Promise<void> {
    await this.page.mouse.down()
  }

  /**
   * Performs mouse up.
   *
   * @returns Promise<void>
   */
  @Step(`Mouse up`)
  async mouseUp(): Promise<void> {
    await this.page.mouse.up()
  }

  /**
   * Scrolls vertically.
   *
   * @param deltaY Vertical scroll amount.
   *
   * @returns Promise<void>
   */
  @Step(`Vertical mouse scroll`)
  async scrollVertical(deltaY: number): Promise<void> {
    await this.page.mouse.wheel(0, deltaY)
  }

  /**
   * Scrolls horizontally.
   *
   * @param deltaX Horizontal scroll amount.
   *
   * @returns Promise<void>
   */
  @Step(`Horizontal mouse scroll`)
  async scrollHorizontal(deltaX: number): Promise<void> {
    await this.page.mouse.wheel(deltaX, 0)
  }

  /**
   * Drags the source element and drops it on the target element.
   *
   * @param source Source locator.
   * @param target Target locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Drag and drop element`)
  async dragAndDrop(
    source: Locator,
    target: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const sourceElement = await this.prepare(source, timeout)
    const targetElement = await this.prepare(target, timeout)

    await sourceElement.dragTo(targetElement)
  }

  /**
   * Moves the mouse to the specified coordinates.
   *
   * @param x X coordinate.
   * @param y Y coordinate.
   *
   * @returns Promise<void>
   */
  @Step(`Move mouse to coordinates`)
  async moveToCoordinates(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y)
  }

  /**
   * Clicks at the specified coordinates.
   *
   * @param x X coordinate.
   * @param y Y coordinate.
   *
   * @returns Promise<void>
   */
  @Step(`Click at coordinates`)
  async clickAt(x: number, y: number): Promise<void> {
    await this.page.mouse.click(x, y)
  }

  /**
   * Double-clicks at the specified coordinates.
   *
   * @param x X coordinate.
   * @param y Y coordinate.
   *
   * @returns Promise<void>
   */
  @Step(`Double click at coordinates`)
  async doubleClickAt(x: number, y: number): Promise<void> {
    await this.page.mouse.dblclick(x, y)
  }

  /**
   * Drags the mouse from one coordinate to another.
   *
   * @param startX Start X coordinate.
   * @param startY Start Y coordinate.
   * @param endX End X coordinate.
   * @param endY End Y coordinate.
   *
   * @returns Promise<void>
   */
  @Step(`Drag mouse using coordinates`)
  async dragByCoordinates(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): Promise<void> {
    await this.page.mouse.move(startX, startY)
    await this.page.mouse.down()
    await this.page.mouse.move(endX, endY)
    await this.page.mouse.up()
  }

  /**
   * Scrolls the mouse wheel.
   *
   * @param deltaX Horizontal scroll amount.
   * @param deltaY Vertical scroll amount.
   *
   * @returns Promise<void>
   */
  @Step(`Scroll mouse wheel`)
  async wheel(deltaX: number, deltaY: number): Promise<void> {
    await this.page.mouse.wheel(deltaX, deltaY)
  }
}
