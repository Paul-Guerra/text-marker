/* global jest */

let handler = {
  pattern: /\*/g,
  onMatch: jest.fn()
};

let buffer = {
  push: jest.fn()
};

export default {
  text: '*foo bar foo baz*',
  buffer,
  handler,
  sampleTokens: [
    { start: 0, type: 'a', name: 'b' },
    { start: 1, type: 'y', name: 'z' },
  ]
};