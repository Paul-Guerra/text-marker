/* global jest */
let handler = {
  pattern: /\*/g,
  onMatch: jest.fn()
};

let notFoundHandler = {
  pattern: /THIS PATTERN SHOULD NOT BE FOUND IN THE TEXT/g,
  onMatch: jest.fn()
};

let buffer = {
  push: jest.fn()
};

let fooAsRange = {
  range: {
    pattern: /foo/gi,
    onMatch: jest.fn(() => [{"name":"FIND","type":"RANGE_START","chars":null,"index":0,"pairedWith":3,"delimiters":{"open":null,"close":null},"priority":3,"handle":"before"},{"name":"FIND","type":"RANGE_END","chars":null,"index":3,"pairedWith":0,"delimiters":{"open":null,"close":null},"priority":-3,"handle":"before"}])
  },
  expected: {"name":"root","children":[{"name":"FIND","attributes":{},"children":[{"name":"TEXT","attributes":{},"text":"foo"}]}]}
};

export default {
  text: '*foo bar foo baz*',
  buffer,
  handler,
  notFoundHandler,
  fooAsRange,
  literalToken: { type: 'LITERAL', name: 'TEXT', chars: 'foo', index: 0 },
  sampleTokens: [
    { start: 0, type: 'a', name: 'b' },
    { start: 1, type: 'y', name: 'z' },
  ]
};
