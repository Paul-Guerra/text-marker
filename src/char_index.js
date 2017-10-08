export default function newIndex(symbol, text) {
  let index = [];
  let pattern = new RegExp(`${symbol}`, 'gi');

  let matches = pattern.exec(text);
  while (matches) {
    index.push(matches.index);
    matches = pattern.exec(text);
  }
  return index;
}
