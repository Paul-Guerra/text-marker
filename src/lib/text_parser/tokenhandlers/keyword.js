/** 
 * Unlike other predefined token patterns, keywords are dynamic during runtime and may change
 * the factory will produce tokenHandlers for a provided array of keywords
 * */

export default function factory(token, type = 'KEYWORD') {
  let pattern;
  if (token instanceof RegExp) pattern = token;
  if (typeof token === 'string') pattern = new RegExp(`${token}`, 'gi');
  if (!pattern) return {};

  return {
    pattern,
    onMatch: function onMatch(match) {
      return {
        type,
        content: match[0],
        index: match.index,
      };
    }
  };
}
