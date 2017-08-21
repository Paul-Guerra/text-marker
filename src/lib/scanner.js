import CharIndex from './char_index';
import newLiteral from './tokens/types/literal';

export function getTokenLength(token) {
  let length = 0;
  switch (token.type) {
    case 'BLOCK_START':
      length = token.delimiters.open.length;
      break;
    case 'BLOCK_END':
      length = token.delimiters.close.length;
      break;
    default:
      length = token.chars.length || 0;
      break;
  }
  return length;
}

// Manages queues of tokens to be flushed when scanning a specific index or character
export default class Scanner {
  constructor(text, patternMatches) {
    this.text = text;
    this.patternMatches = patternMatches;
    this.newLines = new CharIndex('\n');
  }

  /**
   * Does 4 things.
   * Creates a string literal for all the characters between the last token and this one
   * Takes all tokens queued for BEFORE this index and adds them to tokens. 
   * Inserts the last token assigned AT this index and replaces the character in the string.
   * Takes all tokens queued for AFTER this index and adds them to tokens. 
   */
  scan() {
    let tokens = [];
    let tokenAt;
    let offsets = this.patternMatches.getOffsets();
    let count;
    let start;
    let end;
    let literal;
    let before;
    let after;
    let at;

    // add the beginning and end of string to the offsets the text literla substrings are based on
    if (offsets[0] !== 0) offsets.unshift(0);
    if (offsets[offsets.length - 1] !== this.text.length) offsets.push(this.text.length);
    // process index one gretter because there may be tokens that need to be processed 
    // bef ore the end of the string
    count = offsets.length + 1;

    while (count--) {
      tokenAt = null;
      start = start || offsets.shift();
      let literalStart = start;
      end = offsets.shift();

      if (start >= end) continue;
      before = this.patternMatches.on('before', start);
      after = this.patternMatches.on('after', start);
      at = this.patternMatches.on('at', start);
      if (at && at.length) {
        tokenAt = at[at.length - 1];
        literalStart += getTokenLength(tokenAt);
      }

      if (before && before.length) tokens.push(...before);
      if (tokenAt) tokens.push(tokenAt);
      if (literalStart < this.text.length) {
        // there are no literals after the end of the string.
        literal = newLiteral(this.text.substring(literalStart, end), literalStart);
        if (literal.chars) tokens.push(literal);
      }

      if (after && after.length) tokens.push(...after);

      start = end;
    }
    return tokens;
  }
}
