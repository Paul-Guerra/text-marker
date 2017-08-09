import CharIndex from './char_index';

// Manages queues of tokens to be flushed when scanning a specific index or character
export default class Scanner {
  constructor(text, patternMatches) {
    this.text = text;
    this.patternMatches = patternMatches;
    this.newLines = new CharIndex('\n');
    this.offset = -1;
  }

  next() {
    this.offset += 1;
    return this.text[this.offset];
  }

  scan() {
    let tokens = [];
    let char;
    let before;
    let after;
    let at;
    let i;
    let charCount = this.text.length;
    // apparently this is the fastest way to write a loop
    // according to https://jsperf.com/loops/34
    for (i = 0; i < charCount; i++) {
      char = this.next();
      before = this.patternMatches.on('before', i);
      if (before && before.length) tokens.push(...before);

      at = this.patternMatches.on('at', i);
      if (at && at.length) {
        tokens.push(at.pop());
      }

      after = this.patternMatches.on('after', i);
      if (after && after.length) tokens.push(...after);
    }
    return tokens;
  }
}
