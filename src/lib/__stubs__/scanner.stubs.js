let getTokenLengthStub = {
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

export default {
  getTokenLengthStub
};
