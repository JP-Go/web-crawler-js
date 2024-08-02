import { normalizeURL } from './crawl';
import { test, expect } from '@jest/globals';

test('should normalize urls ending with /', () => {
  expect(normalizeURL('https://boot.dev/code/')).toEqual('boot.dev/code');
  expect(normalizeURL('http://boot.dev/code/')).toEqual('boot.dev/code');
});
test('should return the same url if already normalized', () => {
  expect(normalizeURL('https://boot.dev/code')).toEqual('boot.dev/code');
  expect(normalizeURL('http://boot.dev/code/some-path')).toEqual(
    'boot.dev/code/some-path',
  );
});
test('should normalize urls other than urls in the http protocol', () => {
  expect(normalizeURL('postgres://localhost/database')).toEqual(
    'localhost/database',
  );
});

test('should remove username and password from urls', () => {
  expect(
    normalizeURL('mysql://myusername:mypasswd@mysql-server:2333/database'),
  ).toEqual('mysql-server:2333/database');
});

test('should throw if the provided string is not an valid url', () => {
  expect(() => normalizeURL('')).toThrow('Invalid url:');
  expect(() => normalizeURL('not an url')).toThrow('Invalid url: not an url');
});
