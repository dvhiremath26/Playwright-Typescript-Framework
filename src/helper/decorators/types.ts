export interface StepOptions {
  /**
   * Custom Playwright step name.
   *
   * Supports argument placeholders.
   *
   * Example:
   * "Login as {0}"
   */
  name?: string

  /**
   * Enable framework logging.
   *
   * Default: true
   */
  logging?: boolean

  /**
   * Include method arguments in the
   * Playwright step name and logs.
   *
   * Default: false
   */
  includeArguments?: boolean

  /**
   * Argument indexes that must be hidden.
   *
   * Example:
   *
   * redactArguments: [1]
   */
  redactArguments?: number[]

  /**
   * Enable Playwright boxed steps.
   *
   * Default: true
   */
  box?: boolean

  /**
   * Log successful execution.
   *
   * Default: true
   */
  logSuccess?: boolean

  /**
   * Log execution duration.
   *
   * Default: true
   */
  logDuration?: boolean
}

export interface RetryOptions {
  /**
   * Number of retries after
   * the initial attempt.
   *
   * Default: 2
   */
  retries?: number

  /**
   * Delay between retries
   * in milliseconds.
   *
   * Default: 1000
   */
  delay?: number

  /**
   * Enable exponential backoff.
   *
   * Default: false
   */
  exponentialBackoff?: boolean

  /**
   * Maximum retry delay.
   *
   * Default: 30000
   */
  maxDelay?: number

  /**
   * Enable retry-specific logging.
   *
   * Default: true
   */
  logging?: boolean

  /**
   * Determines whether an error
   * should be retried.
   */
  retryIf?: (error: unknown) => boolean

  /**
   * Callback executed before
   * each retry.
   */
  onRetry?: (error: unknown, retryAttempt: number) => void | Promise<void>
}
