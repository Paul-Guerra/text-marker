/** 
 * Unlike other predefined token patterns, keywords are dynamic during runtime and may change
 * the factory will produce tokenHandlers for a provided array of keywords
 * */


export default function factory(keyword, type = 'KEYWORD') {
  return {
    pattern: new RegExp(`${keyword}`, 'gi'),
    onMatch: function onMatch(match) {
      return {
        type,
        content: match[0],
        index: match.index,
      };
    }
  };
}
