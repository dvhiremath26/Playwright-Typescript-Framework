import { test } from '@playwright/test'

import { logger } from './logger'

import type { StepOptions } from './types'

import {
  formatArguments,
  getClassName,
  getErrorMessage,
  getMethodName,
  resolveDynamicName,
} from './decorator.utils'

type StepConfiguration = string | StepOptions

/**
 * Converts a camelCase or PascalCase string to a space-separated,
 * capitalized string (e.g., "getPageURL" -> "Get Page URL").
 */
function formatString(input: string): string {
  return (
    input
      // 1. Insert a space before any capital letter that follows a lowercase letter
      // 2. Insert a space before a capital letter that is followed by a lowercase letter
      //    (to handle acronyms correctly like "getPageURL")
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      // 3. Capitalize the first letter of the resulting string
      .replace(/^./, (str) => str.toUpperCase())
  )
}

export function Step(configuration: StepConfiguration = {}) {
  const options: StepOptions = normalizeStepOptions(configuration)

  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    const methodName = formatString(getMethodName(context))

    async function replacementMethod(this: This, ...args: Args): Promise<Awaited<Return>> {
      const className = getClassName(this)

      const {
        logging = true,
        includeArguments = false,
        redactArguments = [],
        box = true,
        logSuccess = true,
        logDuration = true,
      } = options

      let stepName = options.name ?? `${methodName}`

      stepName = resolveDynamicName(stepName, args, redactArguments)

      if (includeArguments) {
        const formattedArguments = formatArguments(args, redactArguments)

        stepName += ` (${formattedArguments})`
      }

      const executeMethod = async (): Promise<Awaited<Return>> => {
        const startTime = performance.now()

        if (logging) {
          logger.info(`START | ${stepName}`)
        }

        try {
          const result = await target.apply(this, args)

          logSuccessfulExecution(stepName, startTime, logging, logSuccess, logDuration)

          return result
        } catch (error) {
          logFailedExecution(stepName, startTime, logging, error)

          throw error
        }
      }

      return await test.step(stepName, executeMethod, {
        box,
      })
    }

    return replacementMethod
  }
}

function normalizeStepOptions(configuration: StepConfiguration): StepOptions {
  if (typeof configuration === 'string') {
    return {
      name: configuration,
    }
  }

  return configuration
}

function logSuccessfulExecution(
  stepName: string,
  startTime: number,
  logging: boolean,
  logSuccess: boolean,
  logDuration: boolean,
): void {
  if (!logging || !logSuccess) {
    return
  }

  if (logDuration) {
    const duration = performance.now() - startTime

    logger.info(`PASS | ${stepName} | ${duration.toFixed(2)} ms`)

    return
  }

  logger.info(`PASS | ${stepName}`)
}

function logFailedExecution(
  stepName: string,
  startTime: number,
  logging: boolean,
  error: unknown,
): void {
  if (!logging) {
    return
  }

  const duration = performance.now() - startTime

  logger.error(`FAIL | ${stepName} | ${duration.toFixed(2)} ms | ${getErrorMessage(error)}`)
}
