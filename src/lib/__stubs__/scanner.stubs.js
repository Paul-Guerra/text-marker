/* global jest */
const getTokenLengthStub = {
  start: {
    type: 'BLOCK_START',
    delimiters: { open: 'a', close: 'ab' },
    chars: 'abc'
  },
  end: {
    type: 'BLOCK_END',
    delimiters: { open: 'a', close: 'ab' },
    chars: 'abc'
  },
  default: {
    type: 'DEFAULT',
    delimiters: { open: 'a', close: 'ab' },
    chars: 'abc'
  },
  badChars: {
    type: 'DEFAULT',
    delimiters: { open: 'a', close: 'ab' },
  }
};

// used to test that tokens to be handled at a specific index replace the characters at that index
const replaceAtTokens = {
  text: '*foo bar foo baz*',
  patternBuffer: {
    getOffsets: jest.fn(() => [0, 16])
  }
};

export default {
  getTokenLengthStub,
  replaceAtTokens
};
