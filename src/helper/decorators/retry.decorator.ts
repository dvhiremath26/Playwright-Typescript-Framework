import { logger } from './logger'

import type { RetryOptions } from './types'

import { getClassName, getErrorMessage, getMethodName, sleep } from './decorator.utils'

export function Retry(options: RetryOptions = {}) {
  const {
    retries = 2,
    delay = 1000,
    exponentialBackoff = false,
    maxDelay = 30_000,
    logging = true,
    retryIf = () => true,
    onRetry,
  } = options

  validateRetryOptions(retries, delay, maxDelay)

  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    const methodName = getMethodName(context)

    async function replacementMethod(this: This, ...args: Args): Promise<Awaited<Return>> {
      const className = getClassName(this)

      const operationName = `${className}.${methodName}`

      const totalAttempts = retries + 1

      let lastError: unknown

      for (let attempt = 1; attempt <= totalAttempts; attempt++) {
        try {
          return await target.apply(this, args)
        } catch (error) {
          lastError = error

          const hasAttemptsRemaining = attempt < totalAttempts

          const shouldRetry = hasAttemptsRemaining && retryIf(error)

          if (!shouldRetry) {
            throw error
          }

          const retryAttempt = attempt

          const retryDelay = calculateRetryDelay(retryAttempt, delay, exponentialBackoff, maxDelay)

          if (logging) {
            logger.warn(
              `RETRY | ${operationName} | Retry ${retryAttempt}/${retries} | Delay ${retryDelay} ms | ${getErrorMessage(error)}`,
            )
          }

          if (onRetry) {
            await onRetry(error, retryAttempt)
          }

          if (retryDelay > 0) {
            await sleep(retryDelay)
          }
        }
      }

      throw lastError
    }

    return replacementMethod
  }
}

function calculateRetryDelay(
  retryAttempt: number,
  delay: number,
  exponentialBackoff: boolean,
  maxDelay: number,
): number {
  if (!exponentialBackoff) {
    return delay
  }

  return Math.min(delay * 2 ** (retryAttempt - 1), maxDelay)
}

function validateRetryOptions(retries: number, delay: number, maxDelay: number): void {
  if (!Number.isInteger(retries) || retries < 0) {
    throw new Error('"retries" must be a non-negative integer.')
  }

  if (!Number.isFinite(delay) || delay < 0) {
    throw new Error('"delay" must be a non-negative finite number.')
  }

  if (!Number.isFinite(maxDelay) || maxDelay < 0) {
    throw new Error('"maxDelay" must be a non-negative finite number.')
  }
}
