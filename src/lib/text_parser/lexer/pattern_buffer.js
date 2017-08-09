// Manages queues of tokens to be flushed when scanning a specific index OR character


export function tokenSort(a, b) {
  let aPriority = a.priority || 0;
  let bPriority = b.priority || 0;
  if (aPriority < bPriority) return -1;
  if (aPriority > bPriority) return 1;
  return 0;
}

export default class PatternBuffer {
  constructor() {
    this.byOffset = {}; // used for looking up tokens by the string index they are associated with
  }

  on(when, index) {
    let key = `${index}`;
    if (!this.byOffset[key]) return;
    return this.byOffset[key][when].sort(tokenSort);
  }

  push(matches) {
    let count;
    let matchIndex;
    if (matches instanceof Array === false) {
      this.getTokenIndex(matches.index)[matches.handle].push(matches);
    } else {
      count = matches.length;
      while (count--) {
        matchIndex = `${matches[count].index}`;
        this.getTokenIndex(matchIndex)[matches[count].handle].push(matches[count]);
      }
    }
  }

  getTokenIndex(key) {
    let index = this.byOffset;
    let i = typeof index === 'number' ? `${key}` : key;
    if (!index[i]) {
      this.byOffset[i] = {
        before: [], // tokens intended to be inserted before a char at index is processed
        at: [], // tokens intended to replace char at index 
        after: [] // tokens intended to be inserted before a char at index is processed
      };
    }
    return this.byOffset[i];
  }
}
