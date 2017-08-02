import { fixOverlappingBlocks } from './utils';

export function parseTokens(text, { pattern, tokenizer }) {
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

export default function lex(text, tokenizers) {
  let count = tokenizers.length;
  let tokens = [];
  while (count--) {
    tokens.push(parseTokens(text, tokenizers[count]));
  }
  return fixOverlappingBlocks(tokens);
}
