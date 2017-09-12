/* global describe, it, expect */
import { setTokensForIndex, getTokensForIndex, parseBlocks } from '../utils';
import stubs from '../__stubs__/utils.stubs';

function arrayValuesEqual(arr1, arr2) {
  return arr1.every((el, index, arr) => arr[index] === arr2[index]);
}

describe('setTokensForIndex()', () => {
  it('creates the index if it does not exist', () => {
    let tokens = {};
    setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(1);
  });

  it('pushes to exiting index if it doesn exist', () => {
    let tokens = { 3: [{ bar: true }] };
    setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(2);
  });

  it('pushes the token to the index', () => {
    let tokens = {};
    setTokensForIndex('3', { foo: true }, tokens);
    expect(tokens['3'].length).toBe(1);
  });

  it('accepts a number as the index', () => {
    let tokens = {};
    setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(1);
  });
});


describe('getTokensForIndex()', () => {
  it('returns an empty array if the index does not exist', () => {
    expect(getTokensForIndex(1, {}).length).toBe(0);
  });

  it('returns an array if index exists', () => {
    expect(getTokensForIndex(1, { 1: [] }).length).toBe(0);
  });

  it('returns the array in reverse order', () => {
    let tokens = [1, 2, 3];
    let reversed = tokens.reverse();
    let isEqual = arrayValuesEqual(
      reversed,
      getTokensForIndex(1, { 1: tokens })
    );
    expect(isEqual).toBe(true);
  });
});

describe('parseBlocks()', () => {
  it('fixes improperly nested blocks in text', () => {
    expect(
      JSON.stringify(parseBlocks(stubs.badNesting.input))
    ).toBe(
      JSON.stringify(stubs.badNesting.expected)
    );
  });

  it('does not truncate blocks that span table cells', () => {
    let fixedTokens = parseBlocks(stubs.markUpSpansCells.input);
    expect(
      JSON.stringify(fixedTokens)
    ).toBe(
      JSON.stringify(stubs.markUpSpansCells.expected)
    );
  });

  // it('truncates blocks that span table cells', () => {
  //   expect(
  //     JSON.stringify(parseBlocks(stubs.overlappingMarkUpInCell.input))
  //   ).toBe(
  //     JSON.stringify(stubs.overlappingMarkUpInCell.expected)
  //   );
  // });
});
