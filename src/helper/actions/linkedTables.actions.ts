import { Page, Locator } from '@playwright/test'
import { Step } from '@src/helper/decorators'
import { TableActions } from './table.actions'
import { TableDefinition } from '@src/helper/models/table-definition'

/**
 * Provides reusable operations for multiple related tables.
 */
export class LinkedTablesActions {
  private readonly tableActions: TableActions

  /**
   * Initializes the LinkedTablesActions class.
   *
   * @param page Playwright page instance.
   * @param tables Collection of table definitions.
   */
  constructor(
    page: Page,
    private readonly tables: Record<string, TableDefinition>,
  ) {
    this.tableActions = new TableActions(page)
  }

  /**
   * Returns the requested table definition.
   *
   * @param tableName Table name.
   *
   * @returns Table definition.
   */
  private getTable(tableName: string): TableDefinition {
    const table = this.tables[tableName]

    if (!table) {
      throw new Error(`Table '${tableName}' not found.`)
    }

    return table
  }

  /**
   * Finds a row by column value.
   *
   * @param tableName Table name.
   * @param columnName Column header.
   * @param expectedValue Expected value.
   *
   * @returns Row index.
   */
  @Step(`Find row in linked table`)
  async findRow(tableName: string, columnName: string, expectedValue: string): Promise<number> {
    const table = this.getTable(tableName)

    const rowCount = await this.tableActions.getRowCount(table)

    const columnIndex = await this.tableActions.findColumn(table, columnName)

    if (columnIndex === -1) {
      throw new Error(`Column '${columnName}' not found.`)
    }

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const value = await this.tableActions.getCellText(table, rowIndex, columnIndex)

      if (value.trim() === expectedValue.trim()) {
        return rowIndex
      }
    }

    throw new Error(`Value '${expectedValue}' not found in column '${columnName}'.`)
  }

  /**
   * Returns a cell locator.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   *
   * @returns Cell locator.
   */
  @Step(`Get linked table cell`)
  async getCell(tableName: string, rowIndex: number, columnName: string): Promise<Locator> {
    const table = this.getTable(tableName)

    const columnIndex = await this.tableActions.findColumn(table, columnName)

    return await this.tableActions.getCell(table, rowIndex, columnIndex)
  }

  /**
   * Returns cell text.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   *
   * @returns Cell text.
   */
  @Step(`Get linked table cell text`)
  async getCellText(tableName: string, rowIndex: number, columnName: string): Promise<string> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    return (await cell.textContent())?.trim() ?? ''
  }

  /**
   * Clicks a cell.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   */
  @Step(`Click linked table cell`)
  async clickCell(tableName: string, rowIndex: number, columnName: string): Promise<void> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    await cell.click()
  }

  /**
   * Clicks an element inside a cell.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   * @param selector Child element selector.
   */
  @Step(`Click element inside linked table cell`)
  async clickElementInCell(
    tableName: string,
    rowIndex: number,
    columnName: string,
    selector: string,
  ): Promise<void> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    await cell.locator(selector).click()
  }

  /**
   * Fills an input inside a cell.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   * @param value Value to enter.
   */
  @Step(`Fill input inside linked table cell`)
  async fillCell(
    tableName: string,
    rowIndex: number,
    columnName: string,
    value: string,
  ): Promise<void> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    await cell.locator('input').fill(value)
  }

  /**
   * Selects an option inside a cell.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   * @param value Option value.
   */
  @Step(`Select option inside linked table cell`)
  async selectOption(
    tableName: string,
    rowIndex: number,
    columnName: string,
    value: string,
  ): Promise<void> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    await cell.locator('select').selectOption(value)
  }

  /**
   * Checks a checkbox inside a cell.
   *
   * @param tableName Table name.
   * @param rowIndex Row index.
   * @param columnName Column header.
   */
  @Step(`Check checkbox inside linked table cell`)
  async checkCell(tableName: string, rowIndex: number, columnName: string): Promise<void> {
    const cell = await this.getCell(tableName, rowIndex, columnName)

    await cell.locator('input[type="checkbox"]').check()
  }
}
