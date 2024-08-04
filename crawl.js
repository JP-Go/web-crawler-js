import { JSDOM } from 'jsdom';
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

export function getATagsFromHTMLBody(htmlBody) {
  const domObject = new JSDOM(htmlBody);
  return domObject.window.document.querySelectorAll('a');
}

function extractURLFromTag(tag, baseURL) {
  if (tag.hasAttribute('href')) {
    try {
      return new URL(tag.href, baseURL).href;
    } catch (err) {
      console.error(`Invalid url: ${tag.href}, baseURL: ${baseURL}`);
    }
  }
}

export function getURLsFromHTML(htmlBody, baseURL) {
  if (baseURL === undefined) {
    throw new Error('Invalid base URL');
  }

  const atags = getATagsFromHTMLBody(htmlBody);
  return Array.from(atags).map((tag) => extractURLFromTag(tag, baseURL));
}

async function fetchHTML(currentURL) {
  let response = undefined;
  try {
    response = await fetch(currentURL);
  } catch (err) {
    console.error('Failed to fetch url');
    return;
  }
  if (response.status >= 400) {
    console.error('Failed to reach the website', currentURL);
    return;
  }
  const isNotHTML = !response.headers
    .get('content-type')
    .startsWith('text/html');
  if (isNotHTML) {
    console.error(
      'Can not handle content types other than html',
      response.headers.get('content-type'),
    );
    return;
  }
  return response.text();
}

export async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  const isSameDomain =
    new URL(baseURL).hostname === new URL(currentURL).hostname;
  if (!isSameDomain) {
    return pages;
  }
  const normalized = normalizeURL(currentURL);
  if (normalized in pages) {
    pages[normalized] += 1;
    return pages;
  }
  pages[normalized] = 1;
  const html = await fetchHTML(currentURL, pages);
  if (html === undefined) {
    return pages;
  }
  const urls = getURLsFromHTML(html, baseURL);
  const crawlingResult = await Promise.allSettled(
    urls.map((url) => crawlPage(baseURL, url, pages)),
  );
  const mergedResult = crawlingResult
    .map((promisse) =>
      promisse.status === 'fulfilled' ? promisse.value : undefined,
    )
    .filter(Boolean)
    .reduce((acc, curr) => {
      return { ...acc, ...curr };
    });
  pages = { ...pages, ...mergedResult };
  return pages;
}
