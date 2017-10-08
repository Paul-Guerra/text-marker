/* global jest, describe, it, expect */
import range from '../range';
import stubs from '../__stubs__/range.stubs';

global.console = { error: jest.fn() };

describe('Range tokenizer', () => {
  it('creates a regex from a string', () => {
    let newRange = range('TEST');
    expect(newRange.pattern instanceof RegExp).toBe(true);
  });

  it('accepts a regex as an argument', () => {
    let pattern = new RegExp('.*', 'g');
    let newRange = range(pattern);
    expect(newRange.pattern).toBe(pattern);
  });

  it('has an onMatch function', () => {
    expect(typeof range('TEST').onMatch).toBe('function');
  });

  it('returns false if no pattern isnt a string or regex', () => {
    expect(range(3)).toBe(false);
  });

  it('logs an error if no pattern isnt a string or regex', () => {
    range(3);
    expect(console.error).toBeCalled();
  });
});

describe('Range onMatch handler', () => {
  it('returns and array', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result instanceof Array).toBe(true);
  });

  it('contains a RANGE_START type', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[0].type).toBe('RANGE_START');
  });

  it('contains a RANGE_END type', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[1].type).toBe('RANGE_END');
  });

  it('contains an index for the start of the range', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[0].index).toBe(5);
  });

  it('contains an index for the end of the range', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[1].index).toBe(18);
  });

  it('opening token handled before index', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[0].handle).toBe('before');
  });

  it('closing token handled before index', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[1].handle).toBe('before');
  });

  it('opening token has priority', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[0].priority).toBe(23);
  });

  it('closing token has priority', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[1].priority).toBe(-23);
  });


  it('has a positive priority value', () => {
    let result = range('foo').onMatch(stubs.matchResult);
    expect(result[0].priority).toBeGreaterThan(0);
    expect(result[1].priority).toBeLessThan(0);
  });

});
