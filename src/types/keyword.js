import { escapeStringForRegex } from '../utils';

export default function keyword(symbol, name) {
  let pattern;
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp(escapeStringForRegex(`${symbol}`), 'gi');
  if (!pattern) {
    console.error('Cannot create a keyword token without a string or regex. Cannot use:', typeof symbol);
    return false;
  }
  return {
    pattern,
    onMatch: function onMatch(match) {
      let start = match.index;
      return {
        name,
        type: 'KEYWORD',
        chars: `${symbol}`,
        index: start,
        handle: 'at',
      };
    }
  };
}
