/* global describe, it, expect, jest */
import * as utils from '../utils';
import stubs from '../__stubs__/utils.stubs';

function arrayValuesEqual(arr1, arr2) {
  return arr1.every((el, index, arr) => arr[index] === arr2[index]);
}

describe('escapeStringForRegex()', () => {
  it('escapes regex special characters', () => {
    expect(
      utils.escapeStringForRegex('[-/\\^$*?.()|]{}')
    ).toBe(
      '\\[\\-\\/\\\\\\^\\$\\*\\?\\.\\(\\)\\|\\]\\{\\}'
    );
  });
});
describe('setTokensForIndex()', () => {
  it('creates the index if it does not exist', () => {
    let tokens = {};
    utils.setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(1);
  });

  it('pushes to exiting index if it doesn exist', () => {
    let tokens = { 3: [{ bar: true }] };
    utils.setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(2);
  });

  it('pushes the token to the index', () => {
    let tokens = {};
    utils.setTokensForIndex('3', { foo: true }, tokens);
    expect(tokens['3'].length).toBe(1);
  });

  it('accepts a number as the index', () => {
    let tokens = {};
    utils.setTokensForIndex(3, { foo: true }, tokens);
    expect(tokens[3].length).toBe(1);
  });
});


describe('getTokensForIndex()', () => {
  it('returns an empty array if the index does not exist', () => {
    expect(utils.getTokensForIndex(1, {}).length).toBe(0);
  });

  it('returns an array if index exists', () => {
    expect(utils.getTokensForIndex(1, { 1: [] }).length).toBe(0);
  });

  it('returns the array in reverse order', () => {
    let tokens = [1, 2, 3];
    let reversed = tokens.reverse();
    let isEqual = arrayValuesEqual(
      reversed,
      utils.getTokensForIndex(1, { 1: tokens })
    );
    expect(isEqual).toBe(true);
  });
});


describe('updateStack()', () => {
  it('calls stack.pop on BLOCK_END type', () => {
    let pop = jest.fn();
    utils.updateStack({ pop }, { type: 'BLOCK_END' });
    expect(pop.mock.calls.length).toBe(1);
  });

  it('calls stack.pop on RANGE_END type', () => {
    let pop = jest.fn();
    utils.updateStack({ pop }, { type: 'RANGE_END' });
    expect(pop.mock.calls.length).toBe(1);
  });

  it('calls stack.push on BLOCK_START type', () => {
    let push = jest.fn();
    let token = { type: 'BLOCK_START' };
    utils.updateStack({ push }, token);
    expect(push).toBeCalledWith(token);
  });

  it('calls stack.push on RANGE_START type', () => {
    let push = jest.fn();
    let token = { type: 'RANGE_START' };
    utils.updateStack({ push }, token);
    expect(push).toBeCalledWith(token);
  });
});

describe('handleBufferedTokens()', () => {
  it('pushes all tokens to fixedTokens', () => {
    let tokens = [1];
    let fixedTokens = [];
    utils.handleBufferedTokens(tokens, [], fixedTokens);
    expect(fixedTokens.length).toBe(1);
  });

  it('does nothing if tokens are empty', () => {
    let tokens = [];
    let fixedTokens = [];
    utils.handleBufferedTokens(tokens, [], fixedTokens);
    expect(fixedTokens.length).toBe(0);
  });
});

describe('isBlock()', () => {
  it('returns true if type is BLOCK_START or BLOCK_END', () => {
    expect(utils.isBlock({ type: 'BLOCK_START' })).toBe(true);
    expect(utils.isBlock({ type: 'BLOCK_END' })).toBe(true);
  });

  it('returns false if type is not BLOCK_START or BLOCK_END', () => {
    expect(utils.isBlock({ type: 'FOO_START' })).toBe(false);
  });
});

describe('isRange()', () => {
  it('returns true if type is RANGE_START or RANGE_END', () => {
    expect(utils.isRange({ type: 'RANGE_START' })).toBe(true);
    expect(utils.isRange({ type: 'RANGE_END' })).toBe(true);
  });

  it('returns false if type is not RANGE_START or RANGE_END', () => {
    expect(utils.isRange({ type: 'FOO_START' })).toBe(false);
  });
});

describe('isEndToken()', () => {
  it('returns true if type is BLOCK_END or RANGE_END', () => {
    expect(utils.isEndToken({ type: 'BLOCK_END' })).toBe(true);
    expect(utils.isEndToken({ type: 'RANGE_END' })).toBe(true);
  });

  it('returns false if type is not BLOCK_END or RANGE_END', () => {
    expect(utils.isEndToken({ type: 'FOO_END' })).toBe(false);
  });
});

describe('isStartToken()', () => {
  it('returns true if type is BLOCK_START or RANGE_START', () => {
    expect(utils.isStartToken({ type: 'BLOCK_START' })).toBe(true);
    expect(utils.isStartToken({ type: 'RANGE_START' })).toBe(true);
  });

  it('returns false if type is not BLOCK_START or RANGE_START', () => {
    expect(utils.isStartToken({ type: 'FOO_START' })).toBe(false);
  });
});

describe('createVirtualToken()', () => {
  it('adds a _virtual property to the token and sets to true', () => {
    let token = utils.createVirtualToken({ type: 'TEST' });
    expect(token._virtual).toBe(true);
  });

  it('returns a new object', () => {
    let token = { type: 'TEST' };
    let virtualToken = utils.createVirtualToken(token);
    expect(virtualToken).not.toBe(token);
  });
});

describe('createMatch()', () => {
  it('creates a virtual BLOCK_END for a given BLOCK_START', () => {
    let token = utils.createMatch({ type: 'BLOCK_START' });
    expect(token.type).toBe('BLOCK_END');
    expect(token._virtual).toBe(true);
  });

  it('creates a virtual BLOCK_START for a given BLOCK_END', () => {
    let token = utils.createMatch({ type: 'BLOCK_END' });
    expect(token.type).toBe('BLOCK_START');
    expect(token._virtual).toBe(true);
  });

  it('creates a virtual RANGE_END for a given RANGE_START', () => {
    let token = utils.createMatch({ type: 'RANGE_START' });
    expect(token.type).toBe('RANGE_END');
    expect(token._virtual).toBe(true);
  });

  it('creates a virtual RANGE_START for a given RANGE_END', () => {
    let token = utils.createMatch({ type: 'RANGE_END' });
    expect(token.type).toBe('RANGE_START');
    expect(token._virtual).toBe(true);
  });
});

describe('closesPreviousToken()', () => {
  it('returns true if the names are the same and the types are complimentary', () => {
    let result = utils.closesPreviousToken(
      { type: 'BLOCK_END', name: 'FOO' },
      { at: () => { return { type: 'BLOCK_START', name: 'FOO' }; } }
    );
    expect(result).toBe(true);
  });

  it('returns false if the names are not the same', () => {
    let result = utils.closesPreviousToken(
      { type: 'BLOCK_END', name: 'FOO' },
      { at: () => { return { type: 'BLOCK_START', name: 'BAR' }; } }
    );
    expect(result).toBe(false);
  });

  it('returns false if the types are not complimentary', () => {
    let result = utils.closesPreviousToken(
      { type: 'BLOCK_START', name: 'FOO' },
      { at: () => { return { type: 'BLOCK_START', name: 'FOO' }; } }
    );
    expect(result).toBe(false);
  });
});

describe('closeOpenTokens()', () => {
  it('pushes matching virtual tokens to the fixed tokens stack', () => {
    let tokens = [];
    let stack = [{ name: 'FOO', type: 'BLOCK_START' }];
    stack.at = i => stack[i];
    utils.closeOpenTokens(tokens, stack);
    expect(tokens.length).toBe(1);
    expect(tokens[0]._virtual).toBe(true);
    expect(tokens[0].name).toBe('FOO');
    expect(tokens[0].type).toBe('BLOCK_END');
  });

  it('does nothing if there is nothing on the stack to close', () => {
    let tokens = [];
    let stack = [];
    utils.closeOpenTokens(tokens, stack);
    expect(tokens.length).toBe(0);
  });
});

describe('isVisibleToken()', () => {
  it('returns true if token has a non whitespace character', () => {
    let token = { chars: '\n\t W' };
    expect(utils.isVisibleToken(token)).toBe(true);
  });
  it('returns true if token has a only whitespace characters', () => {
    let token = { chars: '\n\t ' };
    expect(utils.isVisibleToken(token)).toBe(false);
  });
});

describe('isVisibleToken()', () => {
  it('returns false if token.chars is falsey', () => {
    expect(utils.isVisibleToken({})).toBe(false);
  });

  it('returns false if token.chars has nothing but whitespace characters', () => {
    expect(utils.isVisibleToken({ chars: ' \n\t' })).toBe(false);
  });

  it('returns true if token.chars has a single visible character', () => {
    expect(utils.isVisibleToken({ chars: '\nQ\t' })).toBe(true);
  });
});

describe('isMatching()', () => {
  it('returns false if the names aren\'t the same', () => {
    expect(utils.isMatching({ name: 'a' }, { name: 'b' })).toBe(false);
  });

  it('returns true if the names match and blocks are complimentary', () => {
    expect(utils.isMatching(
      { name: 'a', type: 'BLOCK_START' },
      { name: 'a', type: 'BLOCK_END' })
    ).toBe(true);
  });

  it('returns false if the names match and blocks are not complimentary', () => {
    expect(utils.isMatching(
      { name: 'a', type: 'BLOCK_START' },
      { name: 'a', type: 'BLOCK_START' })
    ).toBe(false);
  });

  it('returns true if the names match and ranges are complimentary', () => {
    expect(utils.isMatching(
      { name: 'a', type: 'RANGE_START' },
      { name: 'a', type: 'RANGE_END' })
    ).toBe(true);
  });

  it('returns false if the names match and ranges are not complimentary', () => {
    expect(utils.isMatching(
      { name: 'a', type: 'RANGE_START' },
      { name: 'a', type: 'RANGE_START' })
    ).toBe(false);
  });
});

describe('normalize()', () => {
  it('fixes improperly nested blocks in text', () => {
    let results = JSON.stringify(utils.normalize(stubs.badBlockNesting.input));
    let expected = JSON.stringify(stubs.badBlockNesting.expected);
    expect(results).toBe(expected);
  });

  it('handles overlapping ranges of text', () => {
    let results = JSON.stringify(utils.normalize(stubs.overlappingRanges.input));
    let expected = JSON.stringify(stubs.overlappingRanges.expected);
    expect(results).toBe(expected);
  });

  it('closes blocks that span more than one table cell', () => {
    let results = JSON.stringify(utils.normalize(stubs.blockSpansCells.input));
    let expected = JSON.stringify(stubs.blockSpansCells.expected);
    expect(results).toBe(expected);
  });

  it('closes ranges that span more than one table cell', () => {
    let results = JSON.stringify(utils.normalize(stubs.rangeSpansCells.input));
    let expected = JSON.stringify(stubs.rangeSpansCells.expected);
    expect(results).toBe(expected);
  });

  it('removes any end block/ranges that do not have an opening match in the same table cell', () => {
    let results = JSON.stringify(utils.normalize(stubs.blockEndsInTable.input));
    let expected = JSON.stringify(stubs.blockEndsInTable.expected);
    expect(results).toBe(expected);
  });

  it('closes any open start tokens not closed when it finishes the last token', () => {
    let results = JSON.stringify(utils.normalize(stubs.blockIsNotClosedinText.input));
    let expected = JSON.stringify(stubs.blockIsNotClosedinText.expected);
    expect(results).toBe(expected);
  });

  it('blocks can wrap tables', () => {
    let results = JSON.stringify(utils.normalize(stubs.blockWrapsTable.input));
    let expected = JSON.stringify(stubs.blockWrapsTable.expected);
    expect(results).toBe(expected);
  });

  // it('closes any improperly nested tags before it leaves a table cell', () => {
  //   expect(true).toBe(false);
  // });
});
