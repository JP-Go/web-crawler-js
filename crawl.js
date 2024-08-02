export function normalizeURL(uri) {
  try {
    const url = new URL(uri);
    const host = url.host;
    let pathname = url.pathname;
    pathname = pathname.endsWith('/')
      ? pathname.slice(0, pathname.length - 1)
      : pathname;

    return `${host}${pathname}`;
  } catch (err) {
    // TODO: Find out why checking the error type with instanceof does not work
    throw new Error('Invalid url: ' + uri);
  }
}
