import { Dialog, Locator, Page } from '@playwright/test'
import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'

/**
 * Provides reusable dialog, alert and popup interaction methods.
 */
export class DialogActions extends BaseAction {
  /**
   * Initializes the DialogActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Accepts the next browser dialog.
   *
   * @param promptText Optional prompt text.
   *
   * @returns Promise<void>
   */
  @Step(`Accept browser dialog`)
  async accept(promptText?: string): Promise<void> {
    this.page.once('dialog', async (dialog: Dialog) => {
      await dialog.accept(promptText)
    })
  }

  /**
   * Dismisses the next browser dialog.
   *
   * @returns Promise<void>
   */
  @Step(`Dismiss browser dialog`)
  async dismiss(): Promise<void> {
    this.page.once('dialog', async (dialog: Dialog) => {
      await dialog.dismiss()
    })
  }

  /**
   * Returns the browser dialog message.
   *
   * @returns Dialog message.
   */
  @Step(`Get browser dialog message`)
  async getMessage(): Promise<string> {
    return await new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog: Dialog) => {
        const message = dialog.message()

        await dialog.dismiss()

        resolve(message)
      })
    })
  }

  /**
   * Returns the browser dialog type.
   *
   * @returns Dialog type.
   */
  @Step(`Get browser dialog type`)
  async getType(): Promise<string> {
    return await new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog: Dialog) => {
        const type = dialog.type()

        await dialog.dismiss()

        resolve(type)
      })
    })
  }

  /**
   * Waits until a dialog is displayed.
   *
   * @returns Dialog instance.
   */
  @Step(`Wait for browser dialog`)
  async waitForDialog(): Promise<Dialog> {
    return await this.page.waitForEvent('dialog')
  }

  /**
   * Closes a modal dialog.
   *
   * @param closeButtonLocator Close button locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Close modal dialog`)
  async closeModal(
    closeButtonLocator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const closeBrowserElement = await this.prepare(closeButtonLocator, timeout)

    await closeBrowserElement.click()
  }

  /**
   * Waits until a popup window is opened.
   *
   * @returns Popup page.
   */
  @Step(`Wait for popup window`)
  async waitForPopup() {
    return await this.page.waitForEvent('popup')
  }

  /**
   * Waits until a modal dialog becomes visible.
   *
   * @param dialogLocator Dialog locator.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for modal dialog`)
  async waitForModal(
    dialoglocator: Locator,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await this.prepare(dialoglocator, timeout)
  }

  /**
   * Checks whether a modal dialog is visible.
   *
   * @param dialogLocator Dialog locator.
   *
   * @returns True if visible.
   */
  @Step(`Check whether modal dialog is visible`)
  async isModalVisible(dialoglocator: Locator): Promise<boolean> {
    const dialog = await this.prepare(dialoglocator, this.defaultTimeout)
    return dialog ? await dialog.isVisible() : false
  }
}
