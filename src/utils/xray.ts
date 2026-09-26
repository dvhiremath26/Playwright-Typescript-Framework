/** Declare selection tags and Xray import identity together, including skipped tests. */
export function xray(key: string) {
  if (!/^[A-Z][A-Z0-9_]*-[1-9]\d*$/.test(key)) {
    throw new Error('Invalid Xray Test key: ' + key)
  }
  return {
    tag: ['@' + key],
    annotation: [{ type: 'test_key', description: key }],
  }
}
