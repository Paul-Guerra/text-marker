/* global describe, it, expect */
import PatternBuffer, { sortByPriority, offsetSort } from '../pattern_buffer';

describe('sortByPriority()', () => {
  it('puts lower priority values is earlier in the array', () => {
    let result;
    result = sortByPriority({ priority: 2 }, { priority: 3 });
    expect(result).toBe(-1);

    result = sortByPriority({ priority: 4 }, { priority: 3 });
    expect(result).toBe(1);
  });

  it('returns zero in the case of a tie', () => {
    let result;
    result = sortByPriority({ priority: 2 }, { priority: 2 });
    expect(result).toBe(0);
  });
});

describe('offsetSort()', () => {
  it('puts lower priority values is earlier in the array', () => {
    let result;
    result = offsetSort(2, 3);
    expect(result).toBe(-1);

    result = offsetSort(4, 3);
    expect(result).toBe(1);
  });

  it('returns zero in the case of a tie', () => {
    let result;
    result = offsetSort(2, 2);
    expect(result).toBe(0);
  });
});

describe('new PatternBuffer()', () => {
  it('should have properties', () => {
    // let pb = new PatternBuffer();
    expect(true).toBe(true);
  });
});
