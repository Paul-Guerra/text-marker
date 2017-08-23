let matchData = ['*foo bar foo baz*', '*', '*'];
matchData.index = 0;

export default {
  delimiter: { open: '*' },
  delimiters: { open: '*', close: '*' },
  mismatchedDelimiters: { open: '*', close: '-' },
  matchData,
  text: {
    mismatchedDelimiters: 'foo *bar- foo baz',
    repeatedDelimiters: 'foo ***bar*** foo baz'
  }
};
