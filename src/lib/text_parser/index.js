import { pattern as urlPattern, name as urlTokenName } from './tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokens/newline';
import lex from './lexer/';
import literalTokenizer from './tokens/types/literal';
import keywordTokenizer from './tokens/types/keyword';
import textRangeTokenizer from './tokens/types/text_range';
import blockTokenizer from './tokens/types/block';

export function tokenize(text) {
  let symbols = lex(
    text,
    blockTokenizer({ open: '*', close: '*' }, 'BOLD'),
    blockTokenizer({ open: '_', close: '_' }, 'UNDERLINE'),
    blockTokenizer({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    textRangeTokenizer(urlPattern, urlTokenName),
    keywordTokenizer('/buzz', 'BUZZ'),
    textRangeTokenizer('google.com . . .  or', 'HIGHLIGHT')
  );

  if (symbols.length === 0) return symbols;
  // console.log('symbols', symbols);
  // printTokens(fixOverlappingBlocks(symbols));
  // return fixOverlappingBlocks(symbols);
  // let literals = findLiterals(text, symbols);
  // return tokens;
}

export function parse(text) {
  return tokenize(text);
}
