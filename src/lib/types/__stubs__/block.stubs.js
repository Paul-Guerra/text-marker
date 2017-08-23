let matchData = ['*foo bar foo baz*', '*', '*'];
matchData.index = 0;

export default {
  delimiter: { open: '*' },
  delimiters: { open: '*', close: '*' },
  matchData,
  repeatedDelimiters: 'foo ***bar*** foo baz'
};
