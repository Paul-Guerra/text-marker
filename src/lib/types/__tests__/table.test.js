/* global jest, describe, it, expect */
import table from '../table';
import stubs from '../__stubs__/tables.stubs';

global.console = { error: jest.fn() };
describe('Table tokenizer', () => {
  it('returns an object', () => {
    expect(typeof table('\t')).toBe('object');
  });

  it('has a regex pattern', () => {
    let pattern = table('\t').pattern;
    expect(pattern instanceof RegExp).toBe(true);
  });

  it('has an onMatch function', () => {
    let onMatch = table('\t').onMatch;
    expect(typeof onMatch).toBe('function');
  });
});

describe('Table onMatch handler', () => {
  it('returns an array', () => {
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens instanceof Array).toBe(true);
  });

  it('returns TABLE_ROW ranges', () => {
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[0].name).toBe('TABLE_ROW');
    expect(tokens[0].type).toBe('RANGE_START');
    expect(tokens[5].name).toBe('TABLE_ROW');
    expect(tokens[5].type).toBe('RANGE_END');
  });

  it('returns TABLE_CELL ranges', () => {
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[1].name).toBe('TABLE_CELL');
    expect(tokens[1].type).toBe('RANGE_START');
    expect(tokens[2].name).toBe('TABLE_CELL');
    expect(tokens[2].type).toBe('RANGE_END');
    expect(tokens[3].name).toBe('TABLE_CELL');
    expect(tokens[3].type).toBe('RANGE_START');
    expect(tokens[4].name).toBe('TABLE_CELL');
    expect(tokens[4].type).toBe('RANGE_END');
  });


  it('TABLE_ROW starts have a lower priorirty value than TABLE_CELL starts', () => {
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[0].priority < tokens[1].priority).toBe(true);
  });

  it('TABLE_ROW ends have a higher priorirty value than TABLE_CELL ends', () => {
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[5].priority > tokens[4].priority).toBe(true);
  });


  it('should have negative values for TABLE_ROW starts and TABLE_CELL starts', () => {
    // negative values for the starting tokens ensures that table tokens surround text ranges
    // that may start on the same index since text ranges have positive start values
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[0].priority).toBeLessThan(0);
    expect(tokens[1].priority).toBeLessThan(0);
  });


  it('should have positive values for TABLE_ROW ends and TABLE_CELL ends', () => {
    // negative values for the starting tokens ensures that table tokens surround text ranges
    // that may start on the same index since text ranges have positive start values
    let tokens = table('\t').onMatch(stubs.twoColumnMatch);
    expect(tokens[5].priority).toBeGreaterThan(0);
    expect(tokens[4].priority).toBeGreaterThan(0);
  });
});
