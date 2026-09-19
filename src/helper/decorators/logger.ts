import fs from 'node:fs'
import path from 'node:path'

import winston from 'winston'

const LOG_DIRECTORY = path.resolve(process.cwd(), 'reports', 'logs')

fs.mkdirSync(LOG_DIRECTORY, {
  recursive: true,
})

/**
 * Creates one timestamp when the logger
 * module is initialized.
 *
 * This timestamp remains the same
 * throughout the current Playwright run.
 */
const RUN_TIMESTAMP = createRunTimestamp()

const LOG_FILE_NAME = `logs-${RUN_TIMESTAMP}.log`

const LOG_FILE_PATH = path.join(LOG_DIRECTORY, LOG_FILE_NAME)

const { combine, timestamp, printf, errors, colorize } = winston.format

type LogInfo = {
  timestamp?: string
  level: string
  message: unknown
  stack?: string
}

function formatLogMessage(message: unknown): string {
  if (typeof message === 'string') {
    return message
  }

  return JSON.stringify(message)
}

/**
 * File log format.
 */
const fileFormat = combine(
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),

  errors({
    stack: true,
  }),

  printf(({ timestamp, level, message, stack }: LogInfo) => {
    const logLevel = String(level).toUpperCase()
    const logMessage = formatLogMessage(message)

    if (stack) {
      return `${timestamp} ` + `[${logLevel}] ` + `${logMessage}\n${stack}`
    }

    return `${timestamp} ` + `[${logLevel}] ` + `${logMessage}`
  }),
)

/**
 * Console log format.
 */
const consoleFormat = combine(
  colorize(),

  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),

  printf(({ timestamp, level, message }: LogInfo) => {
    const logLevel = String(level)
    const logMessage = formatLogMessage(message)

    return `${timestamp} ` + `[${logLevel}] ` + `${logMessage}`
  }),
)

/**
 * Winston Logger.
 *
 * One log file is created
 * for the current execution.
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',

  transports: [
    /**
     * Terminal logs.
     */
    new winston.transports.Console({
      format: consoleFormat,
    }),

    /**
     * Single execution log file.
     */
    new winston.transports.File({
      filename: LOG_FILE_PATH,

      format: fileFormat,
    }),
  ],

  exitOnError: false,
})

/**
 * Generates timestamp:
 *
 * YYYY-MM-DD_HH-mm-ss
 */
function createRunTimestamp(): string {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(now.getMonth() + 1).padStart(2, '0')

  const day = String(now.getDate()).padStart(2, '0')

  const hours = String(now.getHours()).padStart(2, '0')

  const minutes = String(now.getMinutes()).padStart(2, '0')

  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}` + `_${hours}-${minutes}-${seconds}`
}

/**
 * Returns current execution
 * log file path.
 *
 * Useful for:
 *
 * - Custom Reporter
 * - Allure Attachment
 * - Jenkins Artifact
 */
export function getLogFilePath(): string {
  return LOG_FILE_PATH
}
