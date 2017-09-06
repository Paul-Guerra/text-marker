/* global jest, describe, it, expect */
import lex, { findPatterns, tokensToString, printTokens } from '../lexer';
import stubs from '../__stubs__/lexer.stubs';

global.console = { log: jest.fn() };
describe('findPatterns()', () => {
  it('pushes found patterns onto the buffer', () => {
    let { text, buffer, handler } = stubs;
    findPatterns(text, buffer, handler);
    expect(buffer.push.mock.calls.length).toBe(2);
  });

  it('does not push onto the buffer when no patterns are found', () => {
    let { text, buffer, notFoundHandler } = stubs;
    buffer.push.mockClear();
    findPatterns(text, buffer, notFoundHandler);
    expect(buffer.push.mock.calls.length).toBe(0);
  });
});

describe('tokensToString()', () => {
  it('returns a string', () => {
    const output = tokensToString(stubs.sampleTokens);
    expect(typeof output).toBe('string');
  });
});


describe('printTokens()', () => {
  it('returns a string', () => {
    printTokens(stubs.sampleTokens);
    expect(console.log).toBeCalled();
  });
});
