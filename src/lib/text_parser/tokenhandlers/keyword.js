/** 
 * Unlike other predefined token patterns, keywords are dynamic during runtime and may change
 * the factory will produce tokenHandlers for a provided array of keywords
 * */

function onMatch(match) {
  return {
    type: 'KEYWORD',
    content: match[0],
    index: match.index,
  };
}

export default function factory(keyword) {
  return {
    pattern: new RegExp(`${keyword}`, 'gi'),
    onMatch
  };
}
