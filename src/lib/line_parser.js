import charIndex from './char_index';

export default function newLineParser(text) {
  let newLinesAt = charIndex('\n', text);
  let lines = newLinesAt.length;
  let cursor = 0;
  return (token) => {
    if (newLinesAt.length === 0) return 1;
    if (token.index < newLinesAt[cursor]) return cursor + 1;
    while (token.index > newLinesAt[cursor]) {
      cursor += 1;
    }
    return cursor + 1;
  };
}
