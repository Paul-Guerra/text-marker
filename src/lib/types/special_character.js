/** 
 * This is a variation of the BLOCK type of token handlers
 * since things can be embedded in them (like other words to highlight)
 * the difference is that instead of a predefine visible characters
 * they have only their text to delineate where they begin and end
 * */

export default function specialCharacter(symbol, name, priority = 0) {
  return {
    pattern: new RegExp(`${symbol}`, 'gi'),
    onMatch: function onMatch(match) {
      let start = match.index;
      return {
        name,
        type: 'SPECIAL_CHAR',
        chars: `${symbol}`,
        index: start,
        priority,
        handle: 'at',
      };
    }
  };
}
