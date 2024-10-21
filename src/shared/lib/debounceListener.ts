export function debounceListener<T extends EventListener>(
  handler: T,
  wait: number = 200,
) {
  let timeout: ReturnType<typeof setTimeout>;

  return function debounced(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler.apply(this, args);
    }, wait);
  };
}
