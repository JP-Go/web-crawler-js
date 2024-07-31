export function normalizeURL(path) {
  try {
    const url = new URL(path);
    const host = url.host;
    let pathname = url.pathname;
    pathname = pathname.endsWith('/')
      ? pathname.slice(0, pathname.length - 1)
      : pathname;

    return `${host}${pathname}`;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Invalid url scheme');
    }
  }
}
