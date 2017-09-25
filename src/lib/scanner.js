import newLiteral from './types/literal';
import charIndex from './char_index';
import newLineParser from './line_parser';

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
      length = token.chars ? token.chars.length : 0;
      break;
  }
  return length;
}

export function getCharIndexFromTokens(before, at, after) {
  if (before[0]) return before[0].index;
  if (at[0]) return at[0].index;
  if (after[0]) return after[0].index;
  return false;
}

export function appendLineData(tokens, line) {
  return tokens.map(token => Object.assign({}, token, { line }));
}
// Manages queues of tokens to be flushed when scanning a specific index or character
export default class Scanner {
  constructor(text, patternMatches) {
    this.text = text;
    this.patternMatches = patternMatches;
  }

  /**
   * Does 4 things.
   * Creates a string literal for all the characters between the tokens
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
    let lineParser = newLineParser(this.text);

    // add the beginning and end of string to the offsets the text literal substrings are based on
    if (offsets[0] !== 0) offsets.unshift(0);
    if (offsets[offsets.length - 1] !== this.text.length) offsets.push(this.text.length);

    // process index one greater because there may be tokens that need to be processed 
    // before the end of the string
    count = offsets.length + 1;

    while (count--) {
      tokenAt = null;
      start = start || offsets.shift();
      let literalStart = start;
      let lineNumber;
      end = offsets.shift();

      if (start >= end) continue;
      // todo: replace before/at/after with insert/replace
      before = this.patternMatches.on('before', start);
      after = this.patternMatches.on('after', start);
      at = this.patternMatches.on('at', start);

      lineNumber = lineParser(getCharIndexFromTokens(before, at, after));

      if (at && at.length) {
        tokenAt = at[at.length - 1];
        literalStart += getTokenLength(tokenAt);
      }

      if (before && before.length) tokens.push(...appendLineData(before, lineNumber));
      if (tokenAt) tokens.push(...appendLineData([tokenAt], lineNumber));
      if (literalStart < this.text.length) {
        // there are no literals after the end of the string.
        literal = newLiteral(this.text.substring(literalStart, end), literalStart);
        if (literal.chars) tokens.push(...appendLineData([literal], lineParser(literal.index)));
      }

      if (after && after.length) tokens.push(...appendLineData(after, lineNumber));

      start = end;
    }
    return tokens;
  }
}
