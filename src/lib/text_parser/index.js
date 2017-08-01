import { pattern as urlPattern, name as urlTokenName } from './tokenhandlers/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokenhandlers/newline';
import literalTokenizer from './tokenhandlers/literal';
import keywordTokenHandlerFactory from './tokenhandlers/keyword';
import blockTokenHandlerFactory from './tokenhandlers/block';

function parseTokens(text, { pattern, tokenizer }) {
  if (!text || !pattern || !tokenizer) return [];
  let tokens = [];
  let token;
  let match = pattern.exec(text);
  while (match) {
    if (match) {
      token = tokenizer(match);
      if (token instanceof Array) {
        tokens.push(...token);
      } else {
        tokens.push(token);
      }
    }
    match = pattern.exec(text);
  }
  return tokens;
}

// Split tokens to elimnate any cases where they overLap
// eg. turn tokens like this <b>this is <ul>my text</b> over here</u>
//  into <b>this is <ul>my text</ul></b><u> over here</u>
function fixOverlappingTokens(tokens) {
  let fixedTokens = tokens.map((token, index) => {
    // if the next token starts after me bail
    // if the next token ends after me bails
    return;
  });
  return fixedTokens;
}

export function findSymbols(text) {
  let tokens = Array.concat(
    parseTokens(text, blockTokenHandlerFactory({ open: '*', close: '*' }, 'BOLD')),
    parseTokens(text, blockTokenHandlerFactory({ open: '_', close: '_' }, 'UNDERLINE')),
    parseTokens(text, keywordTokenHandlerFactory(urlPattern, urlTokenName)),
    parseTokens(text, keywordTokenHandlerFactory(newlinePattern, newlineTokenName)),
    parseTokens(text, keywordTokenHandlerFactory('google.com . . .  or', 'HIGHLIGHT'))
  ).sort((a, b) => a.start > b.start);
  // return fixOverlappingTokens(tokens);
  return tokens;
}

export function findLiterals(text, symbols) {
  // if (symbols.length === 0) return [text];
  let readIndex = 0;
  let literal;
  let literals = symbols.map((symbol) => {
    literal = literalTokenizer(text.substring(readIndex, symbol.start), readIndex);
    readIndex = symbol.start + symbol.token.length;
    return literal;
  });
  return literals;
}


function analyze(symbols) {
  let symbolLocations = symbols.map((symbol) => {
    let start = symbol.index;
    let end = symbol.content.length;
  });
}
export function tokenize(text) {
  let symbols = findSymbols(text);
  console.log('symbols', symbols);
  let literals = findLiterals(text, symbols);
  console.log('literals', literals);
  // let tokens = analyze(symbols);
  // return tokens;
}

export function parse(text) {
  let tokens = tokenize(text);

}
