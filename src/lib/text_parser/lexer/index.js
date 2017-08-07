import { parseBlocks } from './utils';

export function parseTokens(text, { pattern, tokenizer }) {
  if (!text || !pattern || !tokenizer) return [];
  let tokens = [];
  let token;
  let match = pattern.exec(text);
  while (match) {
    token = tokenizer(match);
    if (token instanceof Array) {
      tokens.push(...token);
    } else {
      tokens.push(token);
    }
    match = pattern.exec(text);
  }
  return tokens;
}

export function printTokens(tokens) {
  let output = '';
  tokens.forEach((token) => {
    output += `${token.start}, ${token.type}, ${token.name}\n`;
  });
  console.log(output);
}

let tokenSignatures = [];

export function register({ open, close, chars, name }, type, priority = 0) {
  let tokenDef;
  switch (type) {
    case 'KEYWORD':
      tokenDef = { type, chars, name, priority };
      break;
    case 'BLOCK':
      tokenDef = { type, open, close, name, priority };
      break;
    default:
      console.warn(`Warning. Unknown token type ${type}`);
      return;
  }
  tokenSignatures.push(tokenDef);
  return tokenDef;
}

let tokensIndex = { offsets: {} };

// for complicated patterns search for them via regex and place 
// them in a buffer. When the lex parser gets to that index we fush it then
let patternBuffer = {};
function indexPattern(pattern, text, signature) {
  let results = [];
  let match = pattern.exec(text);
  while (match) {
    patternBuffer[`${match.index}`]['BEFORE'] = { signature, match };
    // tokensIndex.offsets[`${match.index}`] = { signature, match };
    // tokensIndex[`${signature.name}_${signature.type}`] = { signature, match };
    match = pattern.exec(text);
  }
}

function isToken(char, tokenSignatures) {}

export default function lex(text) {
  let count = tokenSignatures.length;
  let tokens = [];
  while (count--) {
    indexPattern(tokenSignatures[count], text);
  }
  let at = 0;
  let char;
  let type;
  let tokenData;
  while (at < text.length) {
    // todo: flush tokens before
    char = text.charAt(at);
    tokenData = isToken(char, tokenSignatures);
    if (tokenData) {
      tokens.push(tokenize(tokenData, char, at, text));
    }
    if (tokens[tokens.length - 1].type === 'LITERAL') {
      //append to token
    } else {
      // create literal token and append char
    }
    // todo: flush tokens after
    at += 1; // update if using multiple character tokens
  }
  tokens = tokens.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;

    let aPriority = a.priority || 0;
    let bPriority = b.priority || 0;
    if (aPriority < bPriority) return -1;
    if (aPriority > bPriority) return 1;
    return 0;
  });
  // console.log("BEFORE");
  // printTokens(tokens);
  // tokens = fixOverlappingBlocks(tokens);
  // console.log("AFTER");
  tokens = parseBlocks(tokens);
  printTokens(tokens);
  return tokens;
}
