
// makeSimpleTagRegex MUST match text  surrounded by the provided open and close tags
// this text MAY span more than one line and include white space
// open and close tags MAY contain multiple characters and not be identical to each other
// Text surrounded by multiple instances of the same tag type MUST only match one copy of the tag
// eg <b><b>text is here</b></b> would only return <b>text is here</b> as a token
// 
// regex based on https://stackoverflow.com/questions/11592033/regex-match-text-between-tags
// a simpler expression for matching single character delimters was originally used. See below
// new RegExp(`[${open}]([^${close}]+)[${close}]`, 'gi');

export function makeTagRegex({ open, close = open }) {
  return new RegExp(`\\${open}(?!\\${open})(.+?)\\${close}`, 'gi');
}

export default function factory(tags, name) {
  return {
    pattern: makeTagRegex(tags),
    onMatch: function onMatch(match) {
      return {
        name,
        type: 'TAG',
        content: match[1],
        index: match.index,
      };
    }
  };
}
