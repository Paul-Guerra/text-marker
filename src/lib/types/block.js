/**
 * Intended to produce a basic block patterns from simple characters
 * for example. if open and close are * then it will match *lorem ipsum*
 * In the event of multiple delimiters surounding text it will treat 
 * the outer most delimiters as the token. The others will not be marked as
 * tokens and later treated as literals
 */
export function makeBlockRegex({ open, close = open }) {
  // let escapedOpen = '\\' + open.split('').join('\\');
  // let escapedClose = '\\' + open.split('').join('\\');
  // return new RegExp(`(${escapedOpen}).+?(${escapedClose})`, 'g'); // works for multichar delimiters but not single char. make conditional?
  // return new RegExp(`(${escapedOpen})${escapedOpen}*[^${escapedOpen}]+${escapedClose}*(${escapedClose})`, 'g');
  return new RegExp(`(\\${open})\\${open}*[^${open}]+\\${close}*(\\${close})`, 'g');
}

export default function block(delimiters, name = 'DEFAULT') {
  return {
    pattern: delimiters instanceof RegExp ? delimiters : makeBlockRegex(delimiters),
    onMatch: function onMatch(match) {
      let start = match.index;
      let end = match.index + match[0].length - match[2].length;
      return [
        {
          name,
          type: 'BLOCK_START',
          index: start,
          pairedWith: end,
          chars: match[1],
          handle: 'at',
          delimiters
        },
        {
          name,
          index: end,
          pairedWith: start,
          type: 'BLOCK_END',
          chars: match[2],
          handle: 'at',
          delimiters
        }
      ];
    }
  };
}
