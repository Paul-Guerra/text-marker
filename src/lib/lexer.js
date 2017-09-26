import { normalize } from './utils';
import { insertTableTokens } from './table_utils';
import PatternBuffer from './pattern_buffer';
import Scanner from './scanner';

export function findPatterns(text, buffer, { pattern, onMatch }) {
  if (!text || !pattern || !onMatch) return;
  let tokens;
  let match = pattern.exec(text);
  while (match) {
    tokens = onMatch(match);
    buffer.push(tokens);
    match = pattern.exec(text);
  }
}

export function tokensToString(tokens) {
  let output = '';
  let content;
  tokens.forEach((token) => {
    content = token.type === 'LITERAL' ? `, ${token.chars}` : '';
    content = content.replace('\n', '\\n').replace('\t', '\\t');
    output += `${token.index}, ${token.type}, ${token.name}${content}\n`;
  });
  return output;
}

export function printTokens(tokens) {
  console.log(tokensToString(tokens));
}

export default function lex(text, patterns) {
  let count = patterns.length;
  // initialize buffer
  let buffer = new PatternBuffer();
  while (count--) {
    findPatterns(text, buffer, patterns[count]);
  }
  let tokens = new Scanner(text, buffer).scan();
  // printTokens(tokens);
  let fixedTokens = normalize(tokens);
  // printTokens(fixedTokens);
  return fixedTokens;
}
