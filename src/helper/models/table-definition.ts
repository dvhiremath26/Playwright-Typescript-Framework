import { Locator } from '@playwright/test'

export interface TableDefinition {
  root: Locator
  row: string
  cell: string
  header?: string
  checkbox?: string
}
