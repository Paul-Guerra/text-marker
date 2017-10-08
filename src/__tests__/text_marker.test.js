/* global describe, it, expect, jest */
import tm from '../text_marker';

describe('Text Marker', () => {
  it('is an object', () => {
    expect(typeof tm).toBe('object');
  });

  it('has a parse function', () => {
    expect(typeof tm.parse).toBe('function');
  });

  it('has a keyword function', () => {
    expect(typeof tm.keyword).toBe('function');
  });

  it('has a range function', () => {
    expect(typeof tm.range).toBe('function');
  });

  it('has a block function', () => {
    expect(typeof tm.block).toBe('function');
  });

  it('has a tokensToString function', () => {
    expect(typeof tm.tokensToString).toBe('function');
  });

  it('has a version string', () => {
    expect(typeof tm.version).toBe('string');
  });
});
