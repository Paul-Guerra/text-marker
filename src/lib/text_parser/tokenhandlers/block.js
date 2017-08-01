
// makeSimpleTagRegex MUST match text  surrounded by the provided open and close tags
// this text MAY span more than one line and include white space
// open and close tags MAY contain multiple characters and not be identical to each other
// Text surrounded by multiple instances of the same tag type MUST only match one copy of the tag
// eg <b><b>text is here</b></b> would only return <b>text is here</b> as a token
// 
// regex based on https://stackoverflow.com/questions/11592033/regex-match-text-between-tags
// a simpler expression for matching single character delimters was originally used. See below
// new RegExp(`[${open}]([^${close}]+)[${close}]`, 'gi');
export function makeBlockRegex({ open, close = open }) {
  return new RegExp(`(\\${open})(?!\\${open})(.+?)(\\${close})`, 'gi');
}

/**
 * normally in a lex parser we would have clearly defined openening and closing symbols
 * since the source is plain english (not code) and we need to support 
 * markdown style tag where opening and closing delimeters look exactly alike
 * eg *i am bold*
 * we use the regex to find the text with delimeters and determine the delimeter 
 * characters locations from the match
*/
export default function factory(tags, name) {
  return {
    pattern: makeBlockRegex(tags),
    tokenizer: function tokenizer(match) {
      return [
        {
          start: match.index,
          type: 'BLOCK_START',
          token: match[1]
        },
        {
          start: match.index + match[1].length + match[2].length,
          type: 'BLOCK_END',
          token: match[3]
        }
      ];
    }
  };
}
