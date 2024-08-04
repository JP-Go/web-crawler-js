import { getURLsFromHTML, normalizeURL } from './crawl';
import { test, expect } from '@jest/globals';

test('normalizes urls ending with /', () => {
  expect(normalizeURL('https://boot.dev/code/')).toEqual('boot.dev/code');
  expect(normalizeURL('http://boot.dev/code/')).toEqual('boot.dev/code');
});
test('normalizes urls already normalized', () => {
  expect(normalizeURL('https://boot.dev/code')).toEqual('boot.dev/code');
  expect(normalizeURL('http://boot.dev/code/some-path')).toEqual(
    'boot.dev/code/some-path',
  );
});
test('normalizes protocols other than http/https', () => {
  expect(normalizeURL('postgres://localhost/database')).toEqual(
    'localhost/database',
  );
});

test('removes credentials from urls', () => {
  expect(
    normalizeURL('mysql://myusername:mypasswd@mysql-server:2333/database'),
  ).toEqual('mysql-server:2333/database');
});

test('urls must be valid', () => {
  expect(() => normalizeURL('')).toThrow('Invalid url:');
  expect(() => normalizeURL('not an url')).toThrow('Invalid url: not an url');
});

test('should find all urls', () => {
  expect(
    getURLsFromHTML(
      '<a href="https://boot.dev/code/"></a>',
      'https://boot.dev',
    ),
  ).toHaveLength(1);
  expect(
    getURLsFromHTML(
      `
      <a href="https://boot.dev/code/"></a>
      <a href="https://boot.dev/home/"></a>
      <a href="https://boot.dev/about/"></a>
      `,
      'https://boot.dev',
    ),
  ).toHaveLength(3);
});

test('all urls should be absolute', () => {
  expect(getURLsFromHTML('<a href="/code/"></a>', 'https://boot.dev')).toEqual([
    'https://boot.dev/code/',
  ]);
  expect(
    getURLsFromHTML(
      `
      <a href="/code/owners/"></a>
      <a href="/home/"></a>
      <a href="/about/"></a>
      `,
      'https://boot.dev',
    ),
  ).toEqual([
    'https://boot.dev/code/owners/',
    'https://boot.dev/home/',
    'https://boot.dev/about/',
  ]);
});
