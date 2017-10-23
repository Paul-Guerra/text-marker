import { escapeStringForRegex, makeRegexOrPattern } from '../utils';

export default function keyword(symbol, name) {
  let pattern;
  if (symbol instanceof RegExp) pattern = symbol;

  if (typeof symbol === 'string') {
    pattern = new RegExp(`(^|\\s)(${escapeStringForRegex(symbol)})(\\s|$)`, 'gi');
  }

  if (symbol instanceof Array) {
    pattern = new RegExp(`(^|\\s)(${makeRegexOrPattern(symbol)})(\\s|$)`, 'gi');
  }

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
        chars: match[2],
        index: start,
        handle: 'at',
      };
    }
  };
}
