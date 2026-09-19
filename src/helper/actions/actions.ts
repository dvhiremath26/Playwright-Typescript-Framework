import { Page } from '@playwright/test'

import { BrowserActions } from './browser.actions'
import { CheckboxActions } from './checkbox.actions'
import { DatePickerActions } from './datepicker.actions'
import { DialogActions } from './dialog.actions'
import { DropdownActions } from './dropdown.actions'
import { FrameActions } from './frame.actions'
import { KeyboardActions } from './keyboard.actions'
import { MouseActions } from './mouse.actions'
import { CommonActions } from './common.actions'
import { TableActions } from './table.actions'
import { TextboxActions } from './textbox.actions'
import { ValidationActions } from './validation.actions'
import { WaitActions } from './wait.actions'

export class Actions {
  readonly page: CommonActions
  readonly textbox: TextboxActions
  readonly dropdown: DropdownActions
  readonly checkbox: CheckboxActions
  readonly table: TableActions
  readonly datepicker: DatePickerActions
  readonly dialog: DialogActions
  readonly browser: BrowserActions
  readonly keyboard: KeyboardActions
  readonly mouse: MouseActions
  readonly frame: FrameActions
  readonly wait: WaitActions
  readonly validation: ValidationActions

  constructor(page: Page) {
    this.page = new CommonActions(page)
    this.textbox = new TextboxActions(page)
    this.dropdown = new DropdownActions(page)
    this.checkbox = new CheckboxActions(page)
    this.table = new TableActions(page)
    this.datepicker = new DatePickerActions(page)
    this.dialog = new DialogActions(page)
    this.browser = new BrowserActions(page)
    this.keyboard = new KeyboardActions(page)
    this.mouse = new MouseActions(page)
    this.frame = new FrameActions(page)
    this.wait = new WaitActions(page)
    this.validation = new ValidationActions(page)
  }
}
