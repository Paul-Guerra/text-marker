/* global describe, it, expect, jest */
import newLineParser from '../line_parser';

describe('newLineParser()', () => {
  it('returns a function', () => {
    expect(typeof newLineParser()).toBe('function');
  });
});

describe('lineParser()', () => {
  it('handles single line text', () => {
    let lineParser = newLineParser('I only have one line');
    expect(lineParser(5)).toBe(1);
  });

  it('finds line for token on the first line of multiline text', () => {
    let lineParser = newLineParser('1\n2\n3\n4\n5');
    expect(lineParser(0)).toBe(1);
  });

  it('finds line for token on the middle of multiline text', () => {
    let lineParser = newLineParser('1\n2\n3\n4\n5');
    expect(lineParser(5)).toBe(3);
  });

  it('finds line for token on the last line of multiline text', () => {
    let lineParser = newLineParser('1\n2\n3\n4\n5');
    expect(lineParser(8)).toBe(5);
  });
});
