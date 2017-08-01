/** 
 * Unlike other predefined token patterns, keywords are dynamic during runtime and may change
 * the factory will produce tokenHandlers for a provided array of keywords
 * */

export default function factory(symbol, name) {
  let pattern;
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp(`${symbol}`, 'gi');
  if (!pattern) {
    console.error('Cannot create a keyword token without a pattern');
    return {};
  }

  return {
    pattern,
    tokenizer: function tokenizer(match) {
      return {
        name,
        type: 'KEYWORD',
        chars: match[0],
        start: match.index,
      };
    }
  };
}
