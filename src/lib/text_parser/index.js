import { pattern as urlPattern, name as urlTokenName } from './tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokens/newline';
import tableTokenizer from './tokens/types/table';
import lex from './lexer/';
import literalTokenizer from './tokens/types/literal';
import keywordTokenizer from './tokens/types/keyword';
import textRangeTokenizer from './tokens/types/text_range';
import blockTokenizer from './tokens/types/block';

export function tokenize(text) {
  let tokens = lex(
    text,
    [
      blockTokenizer({ open: '*', close: '*' }, 'BOLD'),
      blockTokenizer({ open: '_', close: '_' }, 'UNDERLINE'),
      blockTokenizer({ open: '-', close: '-' }, 'STRIKETHROUGH'),
      tableTokenizer('\t'),
      textRangeTokenizer(urlPattern, urlTokenName),
      keywordTokenizer('/buzz', 'BUZZ'),
      textRangeTokenizer('google.com . . .  or', 'HIGHLIGHT')
    ]
  );
  // let tokens = lex(text, [tableTokenizer('\t')]);
}

export function parse(text) {
  return tokenize(text);
}
