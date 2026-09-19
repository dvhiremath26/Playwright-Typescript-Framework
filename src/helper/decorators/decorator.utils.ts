const REDACTED_VALUE = '[REDACTED]'

export function getMethodName<This, Args extends unknown[], Return>(
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
): string {
  return String(context.name)
}

export function getClassName(instance: unknown): string {
  if (typeof instance === 'object' && instance !== null && 'constructor' in instance) {
    return instance.constructor.name
  }

  return 'UnknownClass'
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export function formatArguments(args: unknown[], redactArguments: number[] = []): string {
  return args
    .map((argument, index) => {
      if (redactArguments.includes(index)) {
        return REDACTED_VALUE
      }

      return serializeValue(argument)
    })
    .join(', ')
}

export function resolveDynamicName(
  template: string,
  args: unknown[],
  redactArguments: number[] = [],
): string {
  return template.replace(/\{(\d+)\}/g, (_, indexValue: string) => {
    const index = Number(indexValue)

    if (redactArguments.includes(index)) {
      return REDACTED_VALUE
    }

    return serializeValue(args[index])
  })
}

function serializeValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined'
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }

  if (value instanceof Error) {
    return value.message
  }

  try {
    return JSON.stringify(value)
  } catch {
    return '[Unserializable Value]'
  }
}
