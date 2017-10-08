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
  expected: '[{"name":"BOLD","type":"BLOCK_START","index":0,"pairedWith":16,"chars":"*","handle":"at","delimiters":{"open":"*","close":"*"},"line":1},{"type":"LITERAL","name":"TEXT","chars":"foo bar foo baz","index":1,"line":1},{"name":"BOLD","index":16,"pairedWith":0,"type":"BLOCK_END","chars":"*","handle":"at","delimiters":{"open":"*","close":"*"},"line":1}]'
};

const insertBeforeTokens = {
  text: 'foo bar foo baz',
  expected: '[{"name":"FIND","type":"RANGE_START","chars":null,"index":0,"pairedWith":3,"delimiters":{"open":null,"close":null},"priority":3,"handle":"before","line":1},{"type":"LITERAL","name":"TEXT","chars":"foo","index":0,"line":1},{"name":"FIND","type":"RANGE_END","chars":null,"index":3,"pairedWith":0,"delimiters":{"open":null,"close":null},"priority":-3,"handle":"before","line":1},{"type":"LITERAL","name":"TEXT","chars":" bar ","index":3,"line":1},{"name":"FIND","type":"RANGE_START","chars":null,"index":8,"pairedWith":11,"delimiters":{"open":null,"close":null},"priority":19,"handle":"before","line":1},{"type":"LITERAL","name":"TEXT","chars":"foo","index":8,"line":1},{"name":"FIND","type":"RANGE_END","chars":null,"index":11,"pairedWith":8,"delimiters":{"open":null,"close":null},"priority":-19,"handle":"before","line":1},{"type":"LITERAL","name":"TEXT","chars":" baz","index":11,"line":1}]'
};

const createsLiteralTokens = {
  text: 'foo bar foo baz',
  expected: '[{"type":"LITERAL","name":"TEXT","chars":"foo bar foo baz","index":0,"line":1}]'
};

const foo = {
  text: 'foo',
  expected: '[{"name":"FIND","type":"RANGE_START","chars":null,"index":0,"pairedWith":3,"delimiters":{"open":null,"close":null},"priority":3,"handle":"before","line":1},{"type":"LITERAL","name":"TEXT","chars":"foo","index":0,"line":1},{"name":"FIND","type":"RANGE_END","chars":null,"index":3,"pairedWith":0,"delimiters":{"open":null,"close":null},"priority":-3,"handle":"before","line":1}]'
};

export default {
  foo,
  replaceAtTokens,
  getTokenLengthStub,
  insertBeforeTokens,
  createsLiteralTokens,
};
