import { pattern as urlPattern, name as urlTokenName } from './tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokens/newline';
import lex from './lexer/';
import literalTokenizer from './tokens/types/literal';
import keywordTokenizer from './tokens/types/keyword';
import textRangeTokenizer from './tokens/types/text_range';
import blockTokenizer from './tokens/types/block';

export function tokenize(text) {
  let tokens = lex(
    text,
    blockTokenizer({ open: '*', close: '*' }, 'BOLD'),
    blockTokenizer({ open: '_', close: '_' }, 'UNDERLINE'),
    blockTokenizer({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    textRangeTokenizer(urlPattern, urlTokenName),
    keywordTokenizer('/buzz', 'BUZZ'),
    textRangeTokenizer('google.com . . .  or', 'HIGHLIGHT')
  );

  // if (tokens.length === 0) return tokens;
  // console.log('tokens', tokens);
  // printTokens(fixOverlappingBlocks(tokens));
  // return fixOverlappingBlocks(tokens);
  // let literals = findLiterals(text, tokens);
  // return tokens;
}

export function parse(text) {
  return tokenize(text);
}
