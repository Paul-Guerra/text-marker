/* global jest, describe, it, expect */
import lex, { findPatterns, tokensToString, printTokens, applyMiddleware } from '../lexer';
import stubs from '../__stubs__/lexer.stubs';

global.console = { log: jest.fn(), error: jest.fn() };

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

describe('applyMiddleware()', () => {
  it('calls all middleware', () => {
    let first = jest.fn();
    let second = jest.fn();
    applyMiddleware('foo', [first, second]);
    applyMiddleware('foo', stubs.middleware);
    expect(first.mock.calls.length).toBe(1);
    expect(second.mock.calls.length).toBe(1);
  });

  it('passes the result of one middleware to the input of the next', () => {
    let second = jest.fn();
    applyMiddleware('foo', [
      text => 'first',
      second
    ]);
    expect(second.mock.calls.length).toBe(1);
    expect(second).toBeCalledWith(expect.stringMatching('first'));
  });

  it('logs an error if a middleware throws an error', () => {
    console.error.mockReset();
    applyMiddleware('foo', [
      (text) => { throw({ name: 'test', message: 'oops' }); }
    ]);
    expect(console.error).toBeCalled();
    expect(console.error.mock.calls.length).toBe(1);
  });

  it('returns the original text if there was an error', () => {
    let result = applyMiddleware('foo', [
      text => 'bar',
      (text) => { throw({ name: 'test', message: 'oops' }); },
    ]);
    expect(result).toBe('foo');
  });

  // it('passes the result of one middleware to the input of the next', () => {
  //   applyMiddleware('foo', stubs.middleware);
  //   expect(stubs.middleware[1].mock.calls.length).toBe(1);
  //   expect(stubs.middleware[1]).toBeCalledWith(expect.stringContaining('first'));
  //   stubs.middleware[0].mockReset();
  //   stubs.middleware[1].mockReset();
  // });
});
