import { escapeStringForRegex } from '../utils';

export default function keyword(symbol, name) {
  let search = escapeStringForRegex(`${symbol}`);
  return {
    pattern: new RegExp(search, 'gi'),
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
