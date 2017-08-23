let matchData = ['*foo bar foo baz*', '*', '*'];
matchData.index = 0;

export default {
  delimiters: { open: '*', close: '*' },
  matchData
};
