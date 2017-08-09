import CharIndex from './char_index';

// Manages queues of tokens to be flushed when scanning a specific index or character
export default class Scanner {
  constructor(text, patternMatches) {
    this.text = text;
    this.patternMatches = patternMatches;
    this.newLines = new CharIndex('\n');
  }

  scan() {
    let tokens = [];
    let before;
    let after;
    let at;
    let i;
    let offsets = this.patternMatches.getOffsets();
    let count = offsets.length;
    for (i = 0; i < count; i++) {
      // this.text.substr(1, 1000);
      before = this.patternMatches.on('before', offsets[i]);
      if (before && before.length) tokens.push(...before);

      // at = this.patternMatches.on('at', i);
      // if (at && at.length) {
      //   tokens.push(at.pop());
      // }

      after = this.patternMatches.on('after', offsets[i]);
      if (after && after.length) tokens.push(...after);
    }
    return tokens;
  }
}
