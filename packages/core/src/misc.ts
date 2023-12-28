export function isDev() {
  return process.env.NODE_ENV !== 'production';
}

export function isNode() {
  return typeof window === 'undefined';
}
