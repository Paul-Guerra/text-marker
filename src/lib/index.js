import lex from './lexer';

export function tokenize(text) {
  return lex(
    text
  );
}

export function parse(text, patterns) {
  // console.log(text);
  return lex(text, patterns);
}
