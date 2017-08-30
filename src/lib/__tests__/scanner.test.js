/* global jest, describe, it, expect */
import Scanner, { getTokenLength } from '../scanner';
import stubs from '../__stubs__/scanner.stubs';

describe('getTokenLength()', () => {
  it('BLOCK_START type returns the open delimiter length', () => {
    expect(
      getTokenLength(stubs.getTokenLengthStub.start)
    ).toBe(1);
  });

  it('BLOCK_END type returns the close delimiter length', () => {
    expect(
      getTokenLength(stubs.getTokenLengthStub.end)
    ).toBe(2);
  });

  it('Default type returns the chars length', () => {
    expect(
      getTokenLength(stubs.getTokenLengthStub.default)
    ).toBe(3);
  });

  it('Default type returns 0 if chars is falsey', () => {
    expect(
      getTokenLength(stubs.getTokenLengthStub.badChars)
    ).toBe(0);
  });
});

describe('Scanner constructor', () => {
  it('sets text and patterns as properties', () => {
    let scanner = new Scanner('a', 'b');
    expect(scanner.text).toBe('a');
    expect(scanner.patternMatches).toBe('b');
  });
});
