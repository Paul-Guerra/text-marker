/* global describe, it, expect, jest */
import newCharIndex from '../char_index';

describe('newCharIndex()', () => {
  it('returns an array', () => {
    let index = newCharIndex('foo', 'bar');
    expect(index instanceof Array).toBe(true);
  });
});

describe('character index', () => {
  it('length equals number of matches in text', () => {
    let index = newCharIndex('1', 'a1 b1 c1');
    expect(index.length).toBe(3);
  });

  it('contains the string index where the character was found', () => {
    let index = newCharIndex('1', 'a1 b1 c1');
    expect(index[0]).toBe(1);
    expect(index[1]).toBe(4);
    expect(index[2]).toBe(7);
  });
});
