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

      let start = match.index;
      let end = match.index + match[0].length;
      return [
        {
          name,
          type: 'RANGE_START',
          chars: null,
          index: start,
          pairedWith: end,
          delimiters: { open: null, close: null },
          priority: start + end,
          handle: 'before',
        },
        {
          name,
          type: 'RANGE_END',
          chars: null,
          index: end,
          pairedWith: start,
          delimiters: { open: null, close: null },
          priority: (start + end) * -1,
          handle: 'before',
        },
      ];
    }
  };
}
