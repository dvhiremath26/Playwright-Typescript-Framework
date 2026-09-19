# Playwright TypeScript Decorators

Production-oriented decorators for Playwright TypeScript automation frameworks.

## Overview

This module provides reusable decorators for handling Playwright test steps, framework logging, execution duration, error reporting, retries, exponential backoff, conditional retry behavior, and sensitive argument redaction.

The module provides two primary decorators:

* `@Step()`
* `@Retry()`

## Step Decorator

The `@Step()` decorator automatically wraps Page Object or framework methods inside Playwright `test.step()`.

Logging is enabled by default.

The decorator automatically provides:

* Playwright test steps
* START logging
* PASS logging
* FAIL logging
* Execution duration
* Dynamic step names
* Method argument inclusion
* Sensitive argument redaction
* Original error rethrowing

## Basic Usage

```ts
@Step('Navigate to Login Page')
async navigate(): Promise<void> {
    await this.page.goto('/login');
}
```

The method appears as a step in the Playwright report.

Example log output:

```text
START | Navigate to Login Page

PASS | Navigate to Login Page | 425.32 ms
```

## Default Step Name

When no name is provided:

```ts
@Step()
async navigate(): Promise<void> {
}
```

The generated name is:

```text
LoginPage.navigate
```

## Step Options

The decorator supports object-based configuration:

```ts
@Step({
    name: 'Login to Application',
    logging: true,
    includeArguments: false,
    redactArguments: [],
    box: true,
    logSuccess: true,
    logDuration: true
})
async login(): Promise<void> {
}
```

## Logging

Logging is enabled by default.

The following:

```ts
@Step('Click Confirm Button')
async clickConfirm(): Promise<void> {
}
```

automatically logs method execution.

To disable logging:

```ts
@Step({
    name: 'Internal Helper Method',
    logging: false
})
async internalHelper(): Promise<void> {
}
```

## Dynamic Step Names

Method arguments can be referenced using argument indexes.

```ts
@Step({
    name: 'Search for {0}'
})
async search(
    searchText: string
): Promise<void> {
}
```

Calling:

```ts
await search('Playwright');
```

generates:

```text
Search for Playwright
```

## Including Arguments

Arguments can automatically be included in the step name and logs.

```ts
@Step({
    name: 'Create User',
    includeArguments: true
})
async createUser(
    username: string,
    role: string
): Promise<void> {
}
```

Example:

```text
START | Create User (deepak, admin)

PASS | Create User (deepak, admin) | 325.43 ms
```

## Sensitive Argument Redaction

Sensitive values should never be exposed in reports or logs.

```ts
@Step({
    name: 'Login',
    includeArguments: true,
    redactArguments: [1]
})
async login(
    username: string,
    password: string
): Promise<void> {
}
```

Example:

```text
START | Login (deepak, [REDACTED])
```

Passwords, API keys, authentication tokens, secrets, and confidential test data should always be redacted.

## Retry Decorator

The `@Retry()` decorator retries failed method executions.

```ts
@Step('Wait for Dashboard')
@Retry({
    retries: 3,
    delay: 1000
})
async waitForDashboard(): Promise<void> {
}
```

The execution flow is:

```text
Step

    START Log

        Initial Attempt

        Retry 1

        Retry 2

        Retry 3

    PASS or FAIL Log
```

## Retry Options

```ts
@Retry({
    retries: 3,
    delay: 1000,
    exponentialBackoff: true,
    maxDelay: 10000,
    logging: true
})
```

## Exponential Backoff

```ts
@Retry({
    retries: 4,
    delay: 1000,
    exponentialBackoff: true,
    maxDelay: 10000
})
```

Possible delays:

```text
Retry 1: 1000 ms

Retry 2: 2000 ms

Retry 3: 4000 ms

Retry 4: 8000 ms
```

The retry delay never exceeds `maxDelay`.

## Conditional Retry

Not every error should be retried.

Use `retryIf`:

```ts
@Retry({
    retries: 3,

    retryIf: error => {
        return (
            error instanceof Error &&
            error.message.includes('timeout')
        );
    }
})
async waitForDashboard(): Promise<void> {
}
```

## Retry Callback

Use `onRetry` to perform operations before another attempt.

```ts
@Retry({
    retries: 3,

    onRetry: async (
        error,
        attempt
    ) => {
        console.log(
            `Preparing retry ${attempt}`
        );
    }
})
async waitForDashboard(): Promise<void> {
}
```

Potential use cases include:

* Screenshot capture
* Page reload
* Authentication token refresh
* Application state reset
* Additional diagnostic logging

## Recommended Decorator Order

Use:

```ts
@Step('Wait for Dashboard')
@Retry({
    retries: 3
})
async waitForDashboard(): Promise<void> {
}
```

Conceptually:

```text
Step
 └── Logging
      └── Retry
           └── Actual Method
```

This creates one Playwright step and one overall START/PASS/FAIL log sequence.

Retry attempts are handled internally.

## Recommended Practices

Use `@Step()` for business-level Page Object methods, workflow methods, and meaningful framework operations.

Avoid decorating every small private helper method because excessive steps can make reports difficult to read.

Use `@Retry()` only for operations that are safe to execute multiple times.

Do not use retries as a replacement for Playwright auto-waiting, web-first assertions, or proper application-state synchronization.

Avoid retrying non-idempotent operations such as payment submission, account creation, order placement, deletion operations, or database mutations unless the application explicitly guarantees safe retries.

Always redact passwords, authentication tokens, API keys, secrets, and confidential test data.

## Recommended Framework Usage

For normal Page Object methods:

```ts
@Step('Click Confirm Button')
async clickConfirm(): Promise<void> {
}
```

For safe retryable operations:

```ts
@Step('Wait for Expected Application State')
@Retry({
    retries: 3,
    delay: 1000,
    exponentialBackoff: true
})
async waitForExpectedState(): Promise<void> {
}
```

This architecture keeps Page Objects clean while centralizing reporting, logging, timing, error handling, and retry behavior.
