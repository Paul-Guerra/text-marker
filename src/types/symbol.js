import { escapeStringForRegex, makeRegexOrPattern } from '../utils';

export default function keyword(symbol, name, options ={}) {
  let pattern;
  let { setAttributes } = options;
  
  if (symbol instanceof RegExp) pattern = symbol;

  if (typeof symbol === 'string') {
    pattern = new RegExp(`${escapeStringForRegex(symbol)}`, 'gi');
  }

  if (symbol instanceof Array) {
    pattern = new RegExp(`${makeRegexOrPattern(symbol)}`, 'gi');
  }

  if (!pattern) {
    console.error('Cannot create a symbol token without a string or regex. Cannot use:', typeof symbol);
    return false;
  }
  return {
    pattern,
    onMatch: function onMatch(match) {
      let start = match.index;
      let symbol = {
        name,
        type: 'SYMBOL',
        chars: match[0],
        index: start,
        handle: 'at',
      };

      if (typeof setAttributes === 'function') {
        symbol.attributes = setAttributes(match);
      }
      return symbol;
    }
  };
}
