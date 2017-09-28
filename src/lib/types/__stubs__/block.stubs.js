let matchData = ['*foo bar foo baz*', '*', '*'];
// let matchData = ['*foo bar foo baz*', '*', 'foo bar foo baz', '*'];

matchData.index = 0;

export default {
  openOnlyDelimiters: { open: '*' },
  delimiters: { open: '*', close: '*' },
  multiCharDelimiters: { open: '<b>', close: '</b>' },
  mismatchedDelimiters: { open: '*', close: '-' },
  matchData,
  text: {
    basicDelimiter: 'foo *bar* foo',
    multiline: '*foo\nbar\nfoo*',
    multiCharDelimiters: 'this text has <b>bold</b> chars',
    mismatchedDelimiters: 'foo *bar- foo baz',
    repeatedDelimiters: 'foo ***bar*** foo baz'
  }
};
