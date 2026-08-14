export function uniqueName(prefix: string, separator = ' '): string {
  return `${prefix}${separator}${Date.now()}`;
}
