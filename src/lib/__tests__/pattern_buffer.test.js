/* global describe, it, expect, jest */
import PatternBuffer, { sortByPriority, offsetSort } from '../pattern_buffer';
import stubs from '../__stubs__/pattern_buffer.stubs';

describe('sortByPriority()', () => {
  it('puts lower priority values is earlier in the array', () => {
    let result;
    result = sortByPriority(stubs.priority1, stubs.priority2);
    expect(result).toBe(-1);

    result = sortByPriority(stubs.priority2, stubs.priority1);
    expect(result).toBe(1);
  });

  it('returns zero in the case of a tie', () => {
    let result;
    result = sortByPriority(stubs.priority1, stubs.priority1);
    expect(result).toBe(0);
  });

  it('assumes a priority of zero if it doesnt exist for the first argument', () => {
    let result;
    result = sortByPriority({}, stubs.priority1);
    expect(result).toBe(-1);
  });

  it('assumes a priority of zero if it doesnt exist for the second argument', () => {
    let result;
    result = sortByPriority(stubs.priority1, {});
    expect(result).toBe(1);
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

  it('defaults to zero if first argument is undefined', () => {
    let result;
    result = offsetSort(undefined, 2);
    expect(result).toBe(-1);
  });

  it('defaults to zero if second argument is undefined', () => {
    let result;
    result = offsetSort(1);
    expect(result).toBe(1);
  });
});

describe('new PatternBuffer()', () => {
  it('should have atOffset and offsets properties', () => {
    let pb = new PatternBuffer();
    expect(typeof pb.atOffset).toBe('object');
    expect(pb.offsets instanceof Array).toBe(true);
  });
});


describe('PatternBuffer.on()', () => {
  it('returns nothing if the key is not in atOffset object', () => {
    let pb = new PatternBuffer();
    expect(pb.on('at', 'foo')).toBeUndefined();
  });

  it('returns tokens at the index and handle when defined', () => {
    let pb = new PatternBuffer();
    let tokens = [];
    pb.atOffset = stubs.atOffset;
    expect(pb.on('at', '1')).toBe(stubs.atOffset['1'].at);
  });

  it('accepts an integer for an index', () => {
    let pb = new PatternBuffer();
    pb.atOffset = stubs.atOffset;
    expect(pb.on('at', 1)).toBe(stubs.atOffset['1'].at);
  });
});


describe('PatternBuffer.getOffsets()', () => {
  it('returns a sorted array', () => {
    let pb = new PatternBuffer();
    pb.offsets = { sort: jest.fn() };
    expect(pb.getOffsets() instanceof Array).toBe(true);
    expect(pb.offsets.sort).toBeCalledWith(offsetSort);
  });
});

describe('PatternBuffer.push()', () => {
  it('adds a single match object to its indexes', () => {
    let pb = new PatternBuffer();
    let match = stubs.match;
    pb.push(match);
    let index = pb.atOffset[match.index].at;
    expect(index[0]).toBe(match);
    expect(pb.offsets[0]).toBe(match.index);
  });

  it('adds an array of match objects to its indexes', () => {
    let pb = new PatternBuffer();
    let matches = stubs.matches;
    pb.push(matches);
    let at = pb.atOffset[matches[0].index].at;
    let before = pb.atOffset[matches[1].index].before;
    let after = pb.atOffset[matches[2].index].after;
    expect(at.length).toBe(1);
    expect(before.length).toBe(1);
    expect(after.length).toBe(1);
    expect(pb.offsets.length).toBe(matches.length);
  });

  it('does not push to offsets property if match index has already been added', () => {
    let pb = new PatternBuffer();
    pb.hasIndexAtOffset = () => true;
    pb.push(stubs.match);
    expect(pb.offsets.length).toBe(0);
  });

  it('pushes to offsets property if match index has not already been added', () => {
    let pb = new PatternBuffer();
    pb.hasIndexAtOffset = () => false;
    pb.push(stubs.match);
    expect(pb.offsets.length).toBe(1);
  });

  it('does not push to offsets property if matches index has already been added', () => {
    let pb = new PatternBuffer();
    pb.hasIndexAtOffset = () => true;
    pb.push([{ index: 1, handle: 'at' }, { index: 2, handle: 'at' }]);
    expect(pb.offsets.length).toBe(0);
  });

  it('pushes to offsets property if matches index has not already been added', () => {
    let pb = new PatternBuffer();
    pb.hasIndexAtOffset = () => false;
    pb.push([{ index: 1, handle: 'at' }, { index: 2, handle: 'at' }]);
    expect(pb.offsets.length).toBe(2);
  });
});

describe('PatternBuffer.hasIndexAtOffset()', () => {
  it('returns true when a key exists', () => {
    let pb = new PatternBuffer();
    let key;
    key = 'foo';
    pb.atOffset[key] = 'bar';
    expect(pb.hasIndexAtOffset(key)).toBe(true);
  });

  it('returns false when a key does not exist', () => {
    let pb = new PatternBuffer();
    expect(pb.hasIndexAtOffset('DOES_NOT_EXIST')).toBe(false);
  });

  it('accepts a number as an index key', () => {
    let pb = new PatternBuffer();
    let key = 1;
    pb.atOffset[key] = 'bar';
    expect(pb.hasIndexAtOffset(key)).toBe(true);
  });
});

describe('PatternBuffer.getTokenIndex()', () => {
  it('returns value at the requested index', () => {
    let pb = new PatternBuffer();
    let tokens = {};
    pb.atOffset = { foo: tokens };
    expect(pb.getTokenIndex('foo')).toBe(tokens);
  });

  it('returns a new object if one does not exist at the index', () => {
    let pb = new PatternBuffer();
    let tokens = pb.getTokenIndex('foo');
    expect(typeof tokens).toBe('object');
    expect(tokens.before instanceof Array).toBe(true);
    expect(tokens.at instanceof Array).toBe(true);
    expect(tokens.after instanceof Array).toBe(true);
  });
  it('accepts a number as an index', () => {
    let pb = new PatternBuffer();
    pb.atOffset = stubs.atOffset;
    expect(pb.getTokenIndex(1)).toBe(stubs.atOffset['1']);
  });
  // it('returns an object', () => {
  //   let pb = new PatternBuffer();
  // });
});
