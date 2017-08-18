import CharIndex from './char_index';

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

  scan() {
    console.log(this.patternMatches);
    let tokens = [];
    let tokenAt;
    let nextStartOffset = 0;
    let tokenAtStart;
    let tokenAtEnd;
    let offsets = this.patternMatches.getOffsets();
    let count;
    let start;
    let end;
    let literal;
    let before;
    let after;
    let at;
    let i;

    // add the beginning and end of string to the offsets the text literla substrings are based on
    if (offsets[0] !== 0) offsets.unshift(0);
    if (offsets[offsets.length - 1] !== this.text.length - 1) offsets.push(this.text.length - 1);
    count = offsets.length;

    while (offsets.length) {
      tokenAt = null;
      nextStartOffset = 0;
      start = start || offsets.shift();
      let literalStart = start;
      end = offsets.shift();
      // tokenAtStart = this.patternMatches.on('at', start);
      // if the offset has a visible token move start to after the token
      // if (tokenAtStart && tokenAtStart.length) {
      //   literalStart += getTokenLength(tokenAtStart[tokenAtStart.length - 1]);
      // }
      if (start > end) continue;
      before = this.patternMatches.on('before', start);
      after = this.patternMatches.on('after', start);
      at = this.patternMatches.on('at', start);
      if (at && at.length) {
        tokenAt = at[at.length - 1];
        literalStart += getTokenLength(tokenAt);
      }

      if (before && before.length) tokens.push(...before);
      if (tokenAt) tokens.push(tokenAt);

      literal = { value: this.text.substring(literalStart, end), index: literalStart };
      if (literal.value) tokens.push(literal);
      if (literal.value) console.log(literal.value, literalStart, end);

      if (after && after.length) tokens.push(...after);

      start = end;
    }
    return tokens;
  }
  /**
   * Does 4 things.
   * Creates a string literal for all the characters between the last token and this one
   * Takes all tokens queued for BEFORE this index and adds them to tokens. 
   * Inserts the last token assigned AT this index and replaces the character in the string.
   * Takes all tokens queued for AFTER this index and adds them to tokens. 
   */
  xscan() {
    let tokens = [];
    let tokenAt;
    let nextStartOffset = 0;
    let tokenAtStart;
    let tokenAtEnd;
    let offsets = this.patternMatches.getOffsets();
    let count;
    let start = 0;
    let end;
    let literal;
    let before;
    let after;
    let at;
    let i;

    // add the beginning and end of string to the offsets the text literla substrings are based on
    if (offsets[0] !== 0) offsets.unshift(0);
    if (offsets[offsets.length - 1] !== this.text.length - 1) offsets.push(this.text.length - 1);
    count = offsets.length;

    console.log('offsets', offsets);
    console.log('patternMatches', this.patternMatches.atOffset);
    
    // itterate through the offsets and build a string literal from the spaces between the offsets
    for (i = 0; i < count; i++) {
      tokenAt = null;
      start = offsets[i] + nextStartOffset;
      end = offsets[i + 1];
      nextStartOffset = 0;

      if (start >= end) continue;
      tokenAtStart = this.patternMatches.on('at', start);
      // if the offset has a visible token move start to after the token
      if (tokenAtStart && tokenAtStart.length) {
        start += getTokenLength(tokenAtStart[tokenAtStart.length - 1]);
      }

      tokenAtEnd = this.patternMatches.on('at', end);
      if (!tokenAtEnd || tokenAtEnd.length === 0) {
        // if the offset has a visible token move end to before the token
        // subtring method  does not include the char at the end index
        // if there is not token AT the index then the index is there due
        // to an zero width delimiter (like a text range to highlight a word)
        // in that case we want to include the letter
        // end -= getTokenLength(tokenAtStart[tokenAtEnd.length - 1]);
        end += 1;
        // nextStartOffset = 1;
      }

      before = this.patternMatches.on('before', offsets[i]);
      after = this.patternMatches.on('after', offsets[i]);
      at = this.patternMatches.on('at', offsets[i]);
      if (at && at.length) tokenAt = at[at.length - 1];

      // let nextToken = this.patternMatches.on('at', offsets[i + 1]);
      // if (nextToken && nextToken.length !== 0) end += 1;
      if (before && before.length) tokens.push(...before);

      literal = { value: this.text.substring(start, end), index: start };
      if (literal.value) console.log(literal.value, start, end);
      if (literal.value) tokens.push(literal);

      if (tokenAt) tokens.push(tokenAt);

      if (after && after.length) tokens.push(...after);
    }
    return tokens;
  }
}
