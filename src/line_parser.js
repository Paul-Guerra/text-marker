import charIndex from './char_index';

// returns a function that, for a given token, returns the line number it is on
export default function newLineParser(text) {
  let newLinesAt = charIndex('\n', text);
  let lines = newLinesAt.length;
  let cursor = 0;
  return (index) => {
    if (newLinesAt.length === 0) return 1;
    if (index <= newLinesAt[cursor]) return cursor + 1;
    while (index > newLinesAt[cursor]) {
      cursor += 1;
    }
    return cursor + 1;
  };
}
