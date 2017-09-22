export default function newIndex(symbol, text) {
  let pattern;
  let index = [];
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp(`${symbol}`, 'gi');
  if (!pattern) {
    console.error('Cannot create an index without a string or regex. Cannot use:', typeof symbol);
    return false;
  }

  let matches = pattern.exec(text);
  while (matches) {
    index.push(matches.index);
    matches = this.pattern.exec(text);
  }
  return index;
}
