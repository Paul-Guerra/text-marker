import { pattern as urlPattern, name as urlTokenName } from './tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokens/newline';
import tableTokenizer from './tokens/types/table';
import lex, { register } from './lexer/';
import literalTokenizer from './tokens/types/literal';
import keywordTokenizer from './tokens/types/keyword';
import textRangeTokenizer from './tokens/types/text_range';
import blockTokenizer from './tokens/types/block';

export function tokenize(text) {
  register({ open: '*', close: '*', name: 'BOLD' }, 'BLOCK');
  register({ open: '_', close: '_', name: 'UNDERLINE' }, 'BLOCK');
  register({ open: '-', close: '-', name: 'STRIKETHROUGH' }, 'BLOCK');
  // register('\t', 'TABLE_SEP_VALUE', 100);
  // register(urlPattern, urlTokenName, 50);
  // register('/buzz', 'BUZZ');
  // register('google.com', 'HIGHLIGHT', 20);
  // register('Step 1', 'HIGHLIGHT', 25);
  let tokens = lex(text);
  // let tokens = lex(text, [tableTokenizer('\t')]);
}

export function parse(text) {
  // console.log(text);
  return tokenize(text);
}
