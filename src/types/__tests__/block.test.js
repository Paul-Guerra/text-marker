/* global describe, it, expect */
import block, { makeBlockRegex } from '../block';
import stubs from '../__stubs__/block.stubs';

describe('makeBlockRegex', () => {
  it('returns a regular expression', () => {
    let pattern = makeBlockRegex(stubs.delimiters);
    expect(pattern instanceof RegExp).toBe(true);
  });

  it('has a default close delimiter', () => {
    let pattern = makeBlockRegex(stubs.openOnlyDelimiters);
    expect(pattern instanceof RegExp).toBe(true);
  });

  it('matches the outer most delimiters when repeated', () => {
    let result;
    let pattern = makeBlockRegex(stubs.delimiters);
    result = pattern.exec(stubs.text.repeatedDelimiters);
    expect(result[0]).toBe('***bar***');
  });

  it('matches across lines', () => {
    let result;
    let pattern = makeBlockRegex(stubs.delimiters);
    result = pattern.exec(stubs.text.multiline);
    expect(result[0]).toBe(stubs.text.multiline);
  });

  it('returns a block that starts at the location of the first delimiter', () => {
    let result;
    let pattern = makeBlockRegex(stubs.mismatchedDelimiters);
    result = pattern.exec(stubs.text.mismatchedDelimiters);
    expect(result[0]).toBe('*bar-');
  });

  it('can match delimeters with multiple characters', () => {
    let result;
    let pattern = makeBlockRegex(stubs.multiCharDelimiters);
    result = pattern.exec(stubs.text.multiCharDelimiters);
    expect(result[0]).toBe('<b>bold</b>');
    expect(result[1]).toBe('<b>');
    expect(result[2]).toBe('</b>');
  });
});

describe('Block tokenizer', () => {
  it('creates a regex from a delimiter object', () => {
    let newBlock = block(stubs.delimiters);
    expect(newBlock.pattern instanceof RegExp).toBe(true);
  });

  it('accepts a regex as a delimiter', () => {
    let regex = new RegExp('.*', 'g');
    expect(block(regex).pattern).toBe(regex);
  });

  it('has an onMatch function', () => {
    expect(typeof block(stubs.delimiters).onMatch).toBe('function');
  });
});

describe('Block onMatch handler', () => {
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

  it('open delimiter strings should be handled/replaced', () => {
    let result = block(stubs.delimiters, 'NAME').onMatch(stubs.matchData);
    expect(result[0].handle).toBe('at');
    expect(result[1].handle).toBe('at');
  });

  it('close delimiter strings should be handled/replaced', () => {
    let result = block(stubs.delimiters, 'NAME').onMatch(stubs.matchData);
    expect(result[1].handle).toBe('at');
  });

  it('block starts where at the location of the first delimiter', () => {
    let result = block(stubs.delimiters).onMatch(stubs.matchData);
    expect(result[0].index).toBe(0);
  });

  it('block ends where at the location of the first delimiter', () => {
    let result = block(stubs.delimiters).onMatch(stubs.matchData);
    expect(result[1].index).toBe(16);
  });

  it('it can set custom attributes on returned tokens', () => {
    let attr = { foo: 'bar' };
    let setAttr = jest.fn(() => attr);
    let result = block(stubs.delimiters, 'BLOCK', { setAttributes: setAttr }).onMatch(stubs.matchData);
    expect(setAttr.mock.calls.length).toBe(1);
    expect(result[0].attributes).toBe(attr);
    expect(result[1].attributes).toBe(attr);
  });
});
