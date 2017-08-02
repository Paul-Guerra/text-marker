import { pattern as urlPattern, name as urlTokenName } from './tokenhandlers/url';
import { pattern as newlinePattern, name as newlineTokenName } from './tokenhandlers/newline';
import literalTokenizer from './tokenhandlers/literal';
import keywordTokenFactory from './tokenhandlers/keyword';
import textRangeTokenFactory from './tokenhandlers/text_range';
import blockTokenFactory from './tokenhandlers/block';

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

function printTokens(tokens) {
  tokens.forEach((token) => {
    console.log(token.start, token.type, token.name, token);
  });
}
// buffer for tokens waiting to be inserted when lexer is fixing overlapping tokens
let tokensForIndex = {};
function setTokensForIndex(index, token) {
  let key = `${index}`;
  if (tokensForIndex[key] instanceof Array === false) tokensForIndex[key] = [];
  tokensForIndex[key].push(token);
}

function getTokensForIndex(index) {
  if (!tokensForIndex[`${index}`]) return [];
  return tokensForIndex[`${index}`];
}

// Split tokens to eliminate any cases where they overLap
// eg. turn tokens like this <b>this is <ul>my text</b> over here</u>
//  into <b>this is <ul>my text</ul></b><u> over here</u>
// The regular expressions SHOULD be finding only block with matching
// open and close pairs so there SHOULD NOT be any dangling end blocks, etc
function fixOverlappingBlocks(tokens) {
  let blocks = [];
  let currentBlock;
  let fixedTokens = [];
  // let danglingBlocks = [];
  tokens.forEach((token, index) => {
    let bufferedTokens = getTokensForIndex(index);
    if (bufferedTokens.length > 0) {
      fixedTokens.push(...bufferedTokens);
    }
    if (token.type !== 'BLOCK_END') {
      if (token.type === 'BLOCK_START') {
        blocks.push(token);
      }
      fixedTokens.push(token);
      return;
    }

    // At this point we have rules out all types except BLOCK_END
    currentBlock = blocks[blocks.length - 1] || null;

    // if the current open block token doesnt match the current end token
    if (currentBlock && token.name !== currentBlock.name) {
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (token.name !== blocks[i].name) {
          // create a closing token and push to fixed token 
          fixedTokens.push(
            Object.assign({}, blocks[i], { start: null, token: currentBlock.delimiters.close, type: 'BLOCK_END' })
          );
          setTokensForIndex(index + 1, Object.assign({ start: null }, blocks[i]));
          blocks.pop();
        } else {
          // everything looks good go ahead and push the token
          // fixedTokens.push(token);
          blocks.pop();
          break;
        }
      }
    } else {
      // fixedTokens.push(token);
      blocks.pop();
    }
    fixedTokens.push(token);
  });
  return fixedTokens;
}

export function findSymbols(text) {
  let tokens = Array.concat(
    parseTokens(text, blockTokenFactory({ open: '*', close: '*' }, 'BOLD')),
    parseTokens(text, blockTokenFactory({ open: '_', close: '_' }, 'UNDERLINE')),
    parseTokens(text, textRangeTokenFactory(urlPattern, urlTokenName)),
    parseTokens(text, keywordTokenFactory('/buzz', 'BUZZ')),
    parseTokens(text, textRangeTokenFactory('google.com . . .  or', 'HIGHLIGHT'))
  ).sort((a, b) => a.start > b.start);
  // return fixOverlappingTokens(tokens);
  return tokens;
}

export function findLiterals(text, symbols) {
  if (symbols.length === 0) return [literalTokenizer(text, 0)];
  let readIndex = 0;
  let literal;
  let literals = symbols.map((symbol) => {
    literal = literalTokenizer(text.substring(readIndex, symbol.start), readIndex);
    readIndex = symbol.start + symbol.chars.length;
    return literal;
  });
  return literals;
}
export function tokenize(text) {
  let symbols = findSymbols(text);
  console.log('symbols', symbols);
  // fixOverlappingBlocks(symbols);
  printTokens(fixOverlappingBlocks(symbols));
  // let literals = findLiterals(text, symbols);
  // return tokens;
}

export function parse(text) {
  let tokens = tokenize(text);

}
