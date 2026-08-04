export function delay(minMs = 100, maxMs = 400): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function notImplemented(name: string): never {
  throw new Error(`Not implemented - configure API (${name})`);
}
