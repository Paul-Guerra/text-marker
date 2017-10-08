import { normalize } from './utils';
import PatternBuffer from './pattern_buffer';
import Scanner from './scanner';

export function findPatterns(text, buffer, { pattern, onMatch }) {
  if (!text || !pattern || !onMatch || !buffer) return;
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

export function applyMiddleware(text, middleware) {
  try {
    let result = text;
    middleware.forEach((func) => {
      result = func.apply(null, [result]);
    });
    return result;
  } catch (e) {
    console.error(`[Middleware] ${e.message}`);
  }
  return text;
}

export default function lex(inputText, patterns, middleware = []) {
  let text = applyMiddleware(inputText, middleware);
  if (!text && inputText) {
    return inputText;
  }
  let count = patterns.length;
  // initialize buffer
  let buffer = new PatternBuffer();
  while (count--) {
    findPatterns(text, buffer, patterns[count]);
  }
  let tokens = new Scanner(text, buffer).scan();
  let fixedTokens = normalize(tokens);
  return fixedTokens;
}
