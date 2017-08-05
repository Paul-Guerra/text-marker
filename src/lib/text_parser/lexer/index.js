import { fixOverlappingBlocks } from './utils';

export function parseTokens(text, { pattern, tokenizer }) {
  if (!text || !pattern || !tokenizer) return [];
  let tokens = [];
  let token;
  let match = pattern.exec(text);
  while (match) {
    // if (match) {
    token = tokenizer(match);
    if (token instanceof Array) {
      tokens.push(...token);
    } else {
      tokens.push(token);
    }
    // }
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

export default function lex(text, tokenizers) {
  let count = tokenizers.length;
  let tokens = [];
  while (count--) {
    tokens.push(...parseTokens(text, tokenizers[count]));
  }
  tokens = tokens.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
  });
  tokens = fixOverlappingBlocks(tokens);
  printTokens(tokens);
  return tokens;
}
