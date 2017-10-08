import largeText from './large_text.stubs';
import tables from './tables.stubs';

export default {
  tables,
  largeText,
  text: 'yar bar foo baz',
  markupNoWhiteSpace: 'yar b*a*r foo baz',
  mismatchedMarkup: 'i am *bold _and underline* and _',
  linkInMarkup: 'i am *bold http://www.google.com underline* and ?',
  markUp: '*foo bar foo baz*',
  multiMarkUp: 'foo *-bar foo-* baz',
  keyword: 'foo bar /key',
  nestedMarkup: 'i am *bold _and_ underline*',
  danglingMarkup: 'i am *bold _and_ underline* with an _ orphan'
};
