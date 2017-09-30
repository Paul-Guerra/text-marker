/* global describe, it, expect */
import Scanner, { getTokenLength } from '../scanner';
import PatternBuffer from '../pattern_buffer';
import blockSearch from '../../lib/types/block';
import textRangeSearch from '../../lib/types/range';
import { findPatterns } from '../lexer';
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


describe('Scanner scan method', () => {
  // technically I suppose these are really more integrations tests than they are unit tests
  it('pushes "before" and "after" tokens', () => {
    let buffer;
    let { text, expected } = stubs.insertBeforeTokens;
    let patterns = [textRangeSearch('foo', 'FIND')];
    let count = patterns.length;
    buffer = new PatternBuffer();
    while (count--) {
      findPatterns(text, buffer, patterns[count]);
    }
    let tokens = new Scanner(text, buffer).scan();
    expect(JSON.stringify(tokens)).toBe(expected);
  });

  it('replaces characters "at" a specific index with a token', () => {
    let buffer;
    let { text, expected } = stubs.replaceAtTokens;
    let patterns = [blockSearch({ open: '*', close: '*' }, 'BOLD')];
    let count = patterns.length;
    buffer = new PatternBuffer();
    while (count--) {
      findPatterns(text, buffer, patterns[count]);
    }
    let tokens = new Scanner(text, buffer).scan();
    expect(JSON.stringify(tokens)).toBe(expected);
  });

  it('creates a literal tokens', () => {
    let buffer;
    let { text, expected } = stubs.createsLiteralTokens;
    let patterns = [blockSearch({ open: '*', close: '*' }, 'BOLD')];
    let count = patterns.length;
    buffer = new PatternBuffer();
    while (count--) {
      findPatterns(text, buffer, patterns[count]);
    }
    let tokens = new Scanner(text, buffer).scan();
    expect(JSON.stringify(tokens)).toBe(expected);
  });

  it('range can wrap all text', () => {
    let buffer;
    let { text, expected } = stubs.foo;
    let patterns = [textRangeSearch('foo', 'FIND')];
    let count = patterns.length;
    buffer = new PatternBuffer();
    while (count--) {
      findPatterns(text, buffer, patterns[count]);
    }
    let tokens = new Scanner(text, buffer).scan();
    expect(JSON.stringify(tokens)).toBe(expected);
  });
});
