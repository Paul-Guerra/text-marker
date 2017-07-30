

function makeSimpleTagRegex(open, close = open) {
  return new RegExp(`[${open}]([^${close}]+)[${close}]`, 'g');
}

let urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/gim;
// let boldPattern = /\*(?=\S)((?:\*\*|\s+(?:[^\*\s]|\*\*)|[^\s\*])+?)\*(?!\*)/g;
let boldPattern = makeSimpleTagRegex('*');
let underlinePattern = makeSimpleTagRegex('_');

class ParsedText {
  constructor({ text }, tokens = []) {
    this.text = text;
    this.tokens = tokens;
    this.normalizedText = this.text.toLowerCase();
    this.lines = this.normalizedText.split('\n');
    this.tree = {};
    this.markers = [];
  }

  parse() {
    this.buildTree();
  }

  findBold() {
    let match = boldPattern.exec(this.normalizedText);
    while (match) {
      if (match) {
        this.markers.push({
          tag: match[0],
          content: match[1],
          index: match.index,
        });
      }
      match = boldPattern.exec(this.normalizedText);
    }
  }


  findUnderline() {
    let match = underlinePattern.exec(this.normalizedText);
    while (match) {
      if (match) {
        this.markers.push({
          tag: match[0],
          content: match[1],
          index: match.index,
        });
      }
      match = underlinePattern.exec(this.normalizedText);
    }
  }

  buildMarkers() {
    this.findBold();
    this.findUnderline();
    console.log(this.markers);
  }

  buildTree() {
    this.buildMarkers();
  }
}


export default ParsedText;
