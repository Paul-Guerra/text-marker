// Keeps an index of characters and where they can be located in the text for quick lookup
export default class CharIndex {
  constructor(chars, text) {
    this.chars = typeof chars === 'string' ? chars : `${chars}`;
    this.pattern = new RegExp(chars, 'g');
    this.index = [];
    this.buildIndex(text);
  }

  buildIndex(text) {
    let matches = this.pattern.exec(text);
    while (matches) {
      this.index.push(matches.index);
      matches = this.pattern.exec(text);
    }
  }
}
