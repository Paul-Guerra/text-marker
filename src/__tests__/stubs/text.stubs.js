import largeText from './large_text.stubs';

const table  = `Step 1	foo bar baz	lorem ipsum
Step 2	foo2 bar2 baz2	lorem2 ipsum2
Step 3	foo3 bar3 baz3	lorem3 ipsum3
`;

export default {
  table,
  largeText,
  text: 'yar bar foo baz',
  mismatchedMarkup: 'i am *bold _and underline* and _ ?',
  linkInMarkup: 'i am *bold http://www.google.com underline* and ?',
  markUp: 'foo *-bar foo-* baz',
  keyword: 'foo bar /key',
  nestedMarkup: 'i am *bold _and_ underline*',
  danglingMarkup: 'i am *bold _and_ underline* with an _ orphan'
};
