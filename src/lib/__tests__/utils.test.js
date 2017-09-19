/* global describe, it, expect */
import { setTokensForIndex, getTokensForIndex, normalize } from '../utils';
import { tokensToString } from '../lexer';
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

describe('normalize()', () => {
  it('fixes improperly nested blocks in text', () => {
    let results = JSON.stringify(normalize(stubs.badBlockNesting.input));
    let expected = JSON.stringify(stubs.badBlockNesting.expected);
    expect(results).toBe(expected);
  });

  it('handles overlapping ranges of text', () => {
    let results = JSON.stringify(normalize(stubs.overlappingRanges.input));
    let expected = JSON.stringify(stubs.overlappingRanges.expected);
    expect(results).toBe(expected);
  });

  it('closes blocks that span more than one table cell', () => {
    let results = JSON.stringify(normalize(stubs.blockSpansCells.input));
    let expected = JSON.stringify(stubs.blockSpansCells.expected);
    expect(results).toBe(expected);
  });

  it('closes ranges that span more than one table cell', () => {
    let results = JSON.stringify(normalize(stubs.rangeSpansCells.input));
    let expected = JSON.stringify(stubs.rangeSpansCells.expected);
    expect(results).toBe(expected);
  });

  it('removes any end block/ranges that do not have an opening match in the same table cell', () => {
    let results = JSON.stringify(normalize(stubs.blockEndsInTable.input));
    let expected = JSON.stringify(stubs.blockEndsInTable.expected);
    expect(results).toBe(expected);
  });

  it('closes any open start tokens not closed when it finishes the last token', () => {
    let results = JSON.stringify(normalize(stubs.blockIsNotClosedinText.input));
    let expected = JSON.stringify(stubs.blockIsNotClosedinText.expected);
    expect(results).toBe(expected);
  });

  // it('closes any improperly nested tags before it leaves a table cell', () => {
  //   expect(true).toBe(false);
  // });

});
