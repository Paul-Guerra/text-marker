/** 
 * This is a variation of the BLOCK type of token handlers
 * since things can be embedded in them (like other words to highlight)
 * the difference is that instead of a predefine visible characters
 * they have only their text to delineate where they begin and end
 * */

export default function factory(symbol, name, priority = 50) {
  let pattern;
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp(`${symbol}`, 'gi');
  if (!pattern) {
    console.error('Cannot create a text range token without a pattern');
    return [];
  }

  return {
    pattern,
    onMatch: function onMatch(match) {
      return [
        {
          name,
          type: 'RANGE_START',
          chars: null,
          index: match.index,
          delimiters: { open: null, close: null },
          priority: priority * -1,
          handle: 'before',

        },
        {
          name,
          type: 'RANGE_END',
          chars: null,
          index: match.index + match[0].length - 1,
          delimiters: { open: null, close: null },
          priority,
          handle: 'after',
        },
      ];
    }
  };
}
