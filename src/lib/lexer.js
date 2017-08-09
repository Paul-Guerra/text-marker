import { parseBlocks } from './utils';
import PatternBuffer from './pattern_buffer';
import CharIndex from './char_index';
import Scanner from './scanner';

export function findPatterns(text, buffer, { pattern, onMatch }) {
  if (!text || !pattern || !onMatch) return [];
  let tokens;
  let match = pattern.exec(text);
  while (match) {
    tokens = onMatch(match);
    buffer.push(tokens);
    match = pattern.exec(text);
  }
  return buffer;
}

export function printTokens(tokens) {
  let output = '';
  tokens.forEach((token) => {
    output += `${token.start}, ${token.type}, ${token.name}\n`;
  });
  console.log(output);
}

export default function lex(text, patterns) {
  let count = patterns.length;
  // initialize buffer
  let buffer = new PatternBuffer();
  while (count--) {
    findPatterns(text, buffer, patterns[count]);
  }
  let scanner = new Scanner(text, buffer);
  let tokens = scanner.scan();
  console.log(buffer);
  // tokens = tokens.sort((a, b) => {
  //   if (a.start < b.start) return -1;
  //   if (a.start > b.start) return 1;

  //   let aPriority = a.priority || 0;
  //   let bPriority = b.priority || 0;
  //   if (aPriority < bPriority) return -1;
  //   if (aPriority > bPriority) return 1;
  //   return 0;
  // });
  // console.log("BEFORE");
  // printTokens(tokens);
  // tokens = fixOverlappingBlocks(tokens);
  // console.log("AFTER");
  // tokens = parseBlocks(tokens);
  // printTokens(tokens);
  // return tokens;
}
