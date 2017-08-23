/* global describe, it, expect */
import block, { makeBlockRegex } from '../block';
import stubs from '../__stubs__/block.stubs';

describe('makeBlockRegex', () => {
  it('returns a regular expression', () => {
    let pattern = makeBlockRegex(stubs.delimiters);
    expect(pattern instanceof RegExp).toBe(true);
  });
});

describe('Block factory', () => {
  it('creates a regex from a delimiter object ', () => {
    let newBlock = block(stubs.delimiters);
    expect(newBlock.pattern instanceof RegExp).toBe(true);
  });

  it('accepts a regex as a delimiter', () => {
    let regex = new RegExp('.*', 'g');
    expect(block(regex).pattern === regex).toBe(true);
  });

  it('has an onMatch function', () => {
    expect(typeof block(stubs.delimiters).onMatch === 'function').toBe(true);
  });
});

describe('onMatch', () => {
  it('returns an array', () => {
    let result = block(stubs.delimiters).onMatch(stubs.matchData);
    expect(result instanceof Array).toBe(true);
  });

  it('contains a starting block', () => {
    let result = block(stubs.delimiters).onMatch(stubs.matchData);
    expect(result[0].type).toBe('BLOCK_START');
  });

  it('contains an ending block', () => {
    let result = block(stubs.delimiters).onMatch(stubs.matchData);
    expect(result[1].type).toBe('BLOCK_END');
  });

  it('assigns a custom name to blocks', () => {
    let result = block(stubs.delimiters, 'NAME').onMatch(stubs.matchData);
    expect(result[0].name).toBe('NAME');
  });

  it('delimiter strings should be handled/replaced ', () => {
    let result = block(stubs.delimiters, 'NAME').onMatch(stubs.matchData);
    expect(result[0].handle === 'at' && result[1].handle === 'at').toBe(true);
  });
});
