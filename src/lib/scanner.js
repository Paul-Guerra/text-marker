import CharIndex from './char_index';

// function hasVisibleToken(tokens) {
//   let hasVisible = false;
//   let i;
//   let tokenCount = tokens.length;
//   for (i = 0; i < tokenCount; i++) {
//     if (tokens[i].chars && tokens[i].chars.length) {
//       hasVisible = true;
//       break;
//     }
//   }
//   return hasVisible;
// }

// Manages queues of tokens to be flushed when scanning a specific index or character
export default class Scanner {
  constructor(text, patternMatches) {
    this.text = text;
    this.patternMatches = patternMatches;
    this.newLines = new CharIndex('\n');
  }

  scan() {
    let tokens = [];
    let tokenAt;
    let before;
    let after;
    let at;
    let i;
    let offsetDelta;
    let offsets = this.patternMatches.getOffsets();
    let count = offsets.length;
    let start = 0;
    let end = offsets[0];
    let removeCharAtindex; // used to determine if we need to include all text chars when creating token or remove eg, *bold* => bold
    for (i = 0; i <= count; i++) {
      tokenAt = null;
      before = this.patternMatches.on('before', offsets[i]);
      after = this.patternMatches.on('after', offsets[i]);
      at = this.patternMatches.on('at', offsets[i]);

      

      // if there are tokens that will replace the current character
      if (at && at.length) {
        tokenAt = at[at.length - 1];
        removeCharAtindex = true;
        switch (tokenAt.type) {
          case 'BLOCK_START':
            offsetDelta = tokenAt.delimiters.open.length;
            break;
          case 'BLOCK_END':
            offsetDelta = tokenAt.delimiters.close.length;
            break;
          default:
            offsetDelta = tokenAt.chars.length;
            break;
        }
        // tokens.push(tokenAt);
      } else {
        removeCharAtindex = false;
        offsetDelta = 1;
      }

      switch (i) {
        case 0:
          start = 0;
          end = offsets[0];
          break;
        case count:
          // start = offsets[i - 1] + 1;
          start = offsets[i - 1] + offsetDelta;
          end = this.text.length;
          break;
        default:
          // start = offsets[i - 1] + 1;
          if (removeCharAtindex) {
            start = offsets[i - 1] + offsetDelta;
            end = offsets[i];
          } else {
            start = offsets[i - 1];
            end = offsets[i] + offsetDelta;
          }
          break;
      }

      let literal = this.text.substring(start, end);
      // console.log(this.text, start, end);
      console.log(literal);
      if (literal) tokens.push(literal);
      if (before && before.length) tokens.push(...before);
      if (tokenAt) tokens.push(tokenAt);
      if (after && after.length) tokens.push(...after);
    }
    return tokens;
  }
}
