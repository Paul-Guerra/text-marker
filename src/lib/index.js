import { pattern as urlPattern, name as urlTokenName } from './tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokens/newline';
import tableTokenizer from './tokens/types/table';
import lex from './lexer';
// import literalTokenizer from './tokens/types/literal';
// import keywordTokenizer from './tokens/types/keyword';
import textRangeSearch from './tokens/types/text_range';
import blockSearch from './tokens/types/block';

export function tokenize(text) {
  return lex(
    text,
    [
      blockSearch({ open: '*', close: '*' }, 'BOLD'),
      blockSearch({ open: '_', close: '_' }, 'UNDERLINE'),
      blockSearch({ open: '-', close: '-' }, 'STRIKETHROUGH'),
      tableTokenizer('\t', 100),
      textRangeSearch(urlPattern, urlTokenName, 50),
      // keywordTokenizer('/buzz', 'BUZZ'),
      textRangeSearch('bar foo', 'HIGHLIGHT', 20),
      textRangeSearch('bar', 'FIND', 20),
      textRangeSearch('Step 1', 'HIGHLIGHT', 25)
    ]
  );
}

export function parse(text) {
  // console.log(text);
  return tokenize(text);
}
