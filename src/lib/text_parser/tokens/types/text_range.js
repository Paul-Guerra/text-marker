/** 
 * This is a variation of the BLOCK type of token handlers
 * since things can be embedded withing them (like other words to highlight)
 * the difference is that instead of a predefine visible tag
 * they have only their text to delineate where they begin and end
 * */

export default function factory(symbol, name, priority = 50) {
  let pattern;
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp(`${symbol}`, 'gi');
  if (!pattern) {
    console.error('Cannot create a keyword token without a pattern');
    return [];
  }

  return {
    pattern,
    tokenizer: function tokenizer(match) {
      return [
        {
          name,
          type: 'BLOCK_START',
          chars: null,
          start: match.index,
          delimiters: { open: null, close: null },
          priority: priority * -1
        },
        {
          name,
          type: 'BLOCK_END',
          chars: null,
          start: match.index + match[0].length,
          delimiters: { open: null, close: null },
          priority
        },
      ];
    }
  };
}
