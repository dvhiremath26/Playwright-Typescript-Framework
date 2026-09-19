import { Page, Locator } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable keyboard interaction methods.
 */
export class KeyboardActions extends BaseAction {
  /**
   * Initializes the KeyboardActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Presses the specified key on the page.
   *
   * @param key Keyboard key.
   *
   * @returns Promise<void>
   */
  @Step(`Press keyboard key`)
  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key)
  }

  /**
   * Presses the specified key on the target element.
   *
   * @param locator Target locator.
   * @param key Keyboard key.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Press keyboard key on element`)
  async pressOnElement(
    locator: Locator,
    key: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const element = await this.prepare(locator, timeout)

    await element.press(key)
  }

  /**
   * Types text using the keyboard.
   *
   * @param text Text to type.
   * @param delay Delay between key presses.
   *
   * @returns Promise<void>
   */
  @Step(`Type using keyboard`)
  async type(text: string, delay: number = 0): Promise<void> {
    await this.page.keyboard.type(text, {
      delay,
    })
  }

  /**
   * Presses Enter.
   *
   * @returns Promise<void>
   */
  @Step(`Press Enter key`)
  async pressEnter(): Promise<void> {
    await this.press('Enter')
  }

  /**
   * Presses Escape.
   *
   * @returns Promise<void>
   */
  @Step(`Press Escape key`)
  async pressEscape(): Promise<void> {
    await this.press('Escape')
  }

  /**
   * Presses Tab.
   *
   * @returns Promise<void>
   */
  @Step(`Press Tab key`)
  async pressTab(): Promise<void> {
    await this.press('Tab')
  }

  /**
   * Presses Backspace.
   *
   * @returns Promise<void>
   */
  @Step(`Press Backspace key`)
  async pressBackspace(): Promise<void> {
    await this.press('Backspace')
  }

  /**
   * Presses Delete.
   *
   * @returns Promise<void>
   */
  @Step(`Press Delete key`)
  async pressDelete(): Promise<void> {
    await this.press('Delete')
  }

  /**
   * Performs Ctrl+A.
   *
   * @returns Promise<void>
   */
  @Step(`Select all`)
  async selectAll(): Promise<void> {
    await this.press('Control+A')
  }

  /**
   * Performs Ctrl+C.
   *
   * @returns Promise<void>
   */
  @Step(`Copy`)
  async copy(): Promise<void> {
    await this.press('Control+C')
  }

  /**
   * Performs Ctrl+V.
   *
   * @returns Promise<void>
   */
  @Step(`Paste`)
  async paste(): Promise<void> {
    await this.press('Control+V')
  }

  /**
   * Performs Ctrl+X.
   *
   * @returns Promise<void>
   */
  @Step(`Cut`)
  async cut(): Promise<void> {
    await this.press('Control+X')
  }

  /**
   * Performs Ctrl+Z.
   *
   * @returns Promise<void>
   */
  @Step(`Undo`)
  async undo(): Promise<void> {
    await this.press('Control+Z')
  }

  /**
   * Performs Ctrl+Y.
   *
   * @returns Promise<void>
   */
  @Step(`Redo`)
  async redo(): Promise<void> {
    await this.press('Control+Y')
  }

  /**
   * Presses Arrow Up.
   *
   * @returns Promise<void>
   */
  @Step(`Press Arrow Up`)
  async arrowUp(): Promise<void> {
    await this.press('ArrowUp')
  }

  /**
   * Presses Arrow Down.
   *
   * @returns Promise<void>
   */
  @Step(`Press Arrow Down`)
  async arrowDown(): Promise<void> {
    await this.press('ArrowDown')
  }

  /**
   * Presses Arrow Left.
   *
   * @returns Promise<void>
   */
  @Step(`Press Arrow Left`)
  async arrowLeft(): Promise<void> {
    await this.press('ArrowLeft')
  }

  /**
   * Presses Arrow Right.
   *
   * @returns Promise<void>
   */
  @Step(`Press Arrow Right`)
  async arrowRight(): Promise<void> {
    await this.press('ArrowRight')
  }
}
