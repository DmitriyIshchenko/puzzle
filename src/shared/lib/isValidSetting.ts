export function isValidSetting<T extends object>(
  key: string | number | symbol,
  state: T,
): key is keyof T {
  return key in state;
}
