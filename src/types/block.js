import { escapeStringForRegex } from '../utils';
/**
 * Intended to produce a basic block patterns from simple characters
 * for example. if open and close are * then it will match *lorem ipsum*
 * In the event of multiple delimiters surounding text it will treat 
 * the outer most delimiters as the token. The others will not be marked as
 * tokens and later treated as literals
 */
export function makeBlockRegex({ open, close = open }) {
  let escOpen = escapeStringForRegex(open);
  let escClose = escapeStringForRegex(close);
  // return new RegExp(`(${escOpen})(${escOpen})*[^${escOpen}]+(${escClose})*(${escClose})`, 'g');
  return new RegExp(`(${escOpen})+[\\s\\S]+?(${escClose})+`, 'gi');
}

export default function block(delimiters, name = 'DEFAULT') {
  let start;
  let end;

  return {
    pattern: delimiters instanceof RegExp ? delimiters : makeBlockRegex(delimiters),
    onMatch: function onMatch(match) {
      start = match.index;
      end = match.index + match[0].length - match[2].length;
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
