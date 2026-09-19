import { Locator, Page } from '@playwright/test'

import { BaseAction } from './base.actions'
import { Step } from '@src/helper/decorators'
import { TableDefinition } from '@src/helper/models/table-definition'

/**
 * Provides reusable table interaction methods.
 *
 * Supports:
 * - HTML Tables
 * - SAP UI5 Tables
 * - SAP S/4HANA Fiori Tables
 */
export class TableActions extends BaseAction {
  /**
   * Initializes the TableActions class.
   *
   * @param page Playwright page instance.
   */
  constructor(page: Page) {
    super(page)
  }

  /**
   * Returns all rows from the table.
   *
   * @param table Table definition.
   *
   * @returns Locator collection representing table rows.
   */
  private getRows(table: TableDefinition): Locator {
    return table.root.locator(table.row)
  }

  /**
   * Returns all cells for the specified row.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   *
   * @returns Locator collection representing row cells.
   */
  private getCells(table: TableDefinition, rowIndex: number): Locator {
    return this.getRows(table).nth(rowIndex).locator(table.cell)
  }

  /**
   * Returns the specified row.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   *
   * @returns Row locator.
   */
  @Step(`Get table row`)
  async getRow(table: TableDefinition, rowIndex: number): Promise<Locator> {
    return this.getRows(table).nth(rowIndex)
  }

  /**
   * Returns the specified cell.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param columnIndex Zero-based column index.
   *
   * @returns Cell locator.
   */
  @Step(`Get table cell`)
  async getCell(table: TableDefinition, rowIndex: number, columnIndex: number): Promise<Locator> {
    return this.getCells(table, rowIndex).nth(columnIndex)
  }

  /**
   * Returns total number of rows.
   *
   * @param table Table definition.
   *
   * @returns Row count.
   */
  @Step(`Get table row count`)
  async getRowCount(table: TableDefinition): Promise<number> {
    return await this.getRows(table).count()
  }

  /**
   * Returns total number of columns.
   *
   * Calculates based on the first available row.
   *
   * @param table Table definition.
   *
   * @returns Column count.
   */
  @Step(`Get table column count`)
  async getColumnCount(table: TableDefinition): Promise<number> {
    return await this.getCells(table, 0).count()
  }

  /**
   * Returns the text from a specific cell.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param columnIndex Zero-based column index.
   *
   * @returns Cell text.
   */
  @Step(`Get table cell text`)
  async getCellText(
    table: TableDefinition,
    rowIndex: number,
    columnIndex: number,
  ): Promise<string> {
    const cell = await this.getCell(table, rowIndex, columnIndex)

    await this.prepare(cell)

    return (await cell.textContent())?.trim() ?? ''
  }

  /**
   * Clicks the specified table cell.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param columnIndex Zero-based column index.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Click table cell`)
  async clickCell(
    table: TableDefinition,
    rowIndex: number,
    columnIndex: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const cell = await this.getCell(table, rowIndex, columnIndex)

    await this.prepare(cell, timeout)

    await cell.click()
  }

  /**
   * Clicks the specified table row.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Click table row`)
  async clickRow(
    table: TableDefinition,
    rowIndex: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const row = await this.getRow(table, rowIndex)

    await this.prepare(row, timeout)

    await row.click()
  }

  /**
   * Determines whether a row containing the specified text exists.
   *
   * @param table Table definition.
   * @param text Text to search.
   *
   * @returns True if row exists; otherwise false.
   */
  @Step(`Check whether table row exists`)
  async rowExists(table: TableDefinition, text: string): Promise<boolean> {
    const rows = this.getRows(table)
    const rowCount = await rows.count()

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowText = (await rows.nth(rowIndex).textContent())?.trim() ?? ''

      if (rowText.includes(text)) {
        return true
      }
    }

    return false
  }

  /**
   * Finds the row index containing the specified text.
   *
   * @param table Table definition.
   * @param text Text to search.
   *
   * @returns Zero-based row index or -1 if not found.
   */
  @Step(`Find table row`)
  async findRow(table: TableDefinition, text: string): Promise<number> {
    const rows = this.getRows(table)
    const rowCount = await rows.count()

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowText = (await rows.nth(rowIndex).textContent())?.trim() ?? ''

      if (rowText.includes(text)) {
        return rowIndex
      }
    }

    return -1
  }

  /**
   * Returns all cell values from a row.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   *
   * @returns Row values.
   */
  @Step(`Get table row values`)
  async getRowValues(table: TableDefinition, rowIndex: number): Promise<string[]> {
    const cells = this.getCells(table, rowIndex)
    const cellCount = await cells.count()

    const values: string[] = []

    for (let columnIndex = 0; columnIndex < cellCount; columnIndex++) {
      values.push((await cells.nth(columnIndex).textContent())?.trim() ?? '')
    }

    return values
  }

  /**
   * Returns all values from a column.
   *
   * @param table Table definition.
   * @param columnIndex Zero-based column index.
   *
   * @returns Column values.
   */
  @Step(`Get table column values`)
  async getColumnValues(table: TableDefinition, columnIndex: number): Promise<string[]> {
    const rows = this.getRows(table)
    const rowCount = await rows.count()

    const values: string[] = []

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      values.push(await this.getCellText(table, rowIndex, columnIndex))
    }

    return values
  }

  /**
   * Clicks the first row containing the specified text.
   *
   * @param table Table definition.
   * @param text Text to search.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Click table row by text`)
  async clickRowByText(
    table: TableDefinition,
    text: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const rowIndex = await this.findRow(table, text)

    if (rowIndex === -1) {
      throw new Error(`Row not found with text: ${text}`)
    }

    await this.clickRow(table, rowIndex, timeout)
  }

  /**
   * Clicks a cell in the row containing the specified text.
   *
   * @param table Table definition.
   * @param rowText Row text.
   * @param columnIndex Zero-based column index.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Click table cell by row text`)
  async clickCellByRowText(
    table: TableDefinition,
    rowText: string,
    columnIndex: number,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const rowIndex = await this.findRow(table, rowText)

    if (rowIndex === -1) {
      throw new Error(`Row not found with text: ${rowText}`)
    }

    await this.clickCell(table, rowIndex, columnIndex, timeout)
  }

  /**
   * Returns all column headers.
   *
   * @param table Table definition.
   *
   * @returns List of column headers.
   */
  @Step(`Get table headers`)
  async getHeaders(table: TableDefinition): Promise<string[]> {
    if (!table.header) {
      throw new Error('Header locator is not configured.')
    }

    const headers = table.root.locator(table.header)
    const count = await headers.count()

    const values: string[] = []

    for (let index = 0; index < count; index++) {
      values.push((await headers.nth(index).textContent())?.trim() ?? '')
    }

    return values
  }

  /**
   * Returns the column index for the specified header.
   *
   * @param table Table definition.
   * @param header Header text.
   *
   * @returns Zero-based column index.
   */
  @Step(`Find table column by header`)
  async findColumn(table: TableDefinition, header: string): Promise<number> {
    const headers = await this.getHeaders(table)

    return headers.findIndex(
      (column) => column.trim().toLowerCase() === header.trim().toLowerCase(),
    )
  }

  /**
   * Returns a cell value using the column header.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param header Header text.
   *
   * @returns Cell value.
   */
  @Step(`Get table cell text by header`)
  async getCellTextByHeader(
    table: TableDefinition,
    rowIndex: number,
    header: string,
  ): Promise<string> {
    const columnIndex = await this.findColumn(table, header)

    if (columnIndex === -1) {
      throw new Error(`Header '${header}' not found.`)
    }

    return await this.getCellText(table, rowIndex, columnIndex)
  }

  /**
   * Clicks a column header.
   *
   * Useful for sorting HTML and SAP UI5 tables.
   *
   * @param table Table definition.
   * @param header Header text.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Click table header`)
  async clickHeader(
    table: TableDefinition,
    header: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    if (!table.header) {
      throw new Error('Header locator is not configured.')
    }

    const headers = table.root.locator(table.header)
    const count = await headers.count()

    for (let index = 0; index < count; index++) {
      const headerLocator = headers.nth(index)

      if ((await headerLocator.textContent())?.trim() === header) {
        await this.prepare(headerLocator, timeout)

        await headerLocator.click()

        return
      }
    }

    throw new Error(`Header '${header}' not found.`)
  }

  /**
   * Sorts the table by clicking the specified column header.
   *
   * @param table Table definition.
   * @param header Header text.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Sort table by column`)
  async sortByColumn(
    table: TableDefinition,
    header: string,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    await this.clickHeader(table, header, timeout)
  }

  /**
   * Selects a row by clicking its checkbox.
   *
   * Assumes the checkbox is in the specified column.
   *
   * @param table Table definition.
   * @param rowIndex Zero-based row index.
   * @param checkboxColumnIndex Checkbox column index.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Select table row`)
  async selectRow(
    table: TableDefinition,
    rowIndex: number,
    checkboxColumnIndex: number = 0,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const checkbox = await this.getCell(table, rowIndex, checkboxColumnIndex)

    await this.prepare(checkbox, timeout)

    await checkbox.locator('input[type="checkbox"]').check()
  }

  /**
   * Selects a row using row text.
   *
   * @param table Table definition.
   * @param rowText Row text.
   * @param checkboxColumnIndex Checkbox column index.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Select table row by text`)
  async selectRowByText(
    table: TableDefinition,
    rowText: string,
    checkboxColumnIndex: number = 0,
    timeout: number = this.defaultTimeout,
  ): Promise<void> {
    const rowIndex = await this.findRow(table, rowText)

    if (rowIndex === -1) {
      throw new Error(`Row '${rowText}' not found.`)
    }

    await this.selectRow(table, rowIndex, checkboxColumnIndex, timeout)
  }

  /**
   * Waits until the table contains at least one row.
   *
   * Useful for SAP S/4HANA tables after filtering or navigation.
   *
   * @param table Table definition.
   * @param timeout Maximum wait time.
   *
   * @returns Promise<void>
   */
  @Step(`Wait for table data`)
  async waitForRows(table: TableDefinition, timeout: number = this.defaultTimeout): Promise<void> {
    await this.page.waitForFunction(
      ({ root, row }) => {
        const tableElement = document.querySelector(root)

        if (!tableElement) {
          return false
        }

        return tableElement.querySelectorAll(row).length > 0
      },
      {
        root: await table.root.evaluate((element) => {
          if (!element.id) {
            throw new Error('Table root should have an id for waitForRows().')
          }

          return `#${element.id}`
        }),
        row: table.row,
      },
      {
        timeout,
      },
    )
  }
}
