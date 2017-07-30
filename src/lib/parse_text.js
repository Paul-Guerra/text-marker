

function makeSimpleTagRegex(open, close = open) {
  return new RegExp(`[${open}]([^${close}]+)[${close}]`, 'g');
}

let urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/gim;
// let boldPattern = /\*(?=\S)((?:\*\*|\s+(?:[^\*\s]|\*\*)|[^\s\*])+?)\*(?!\*)/g;


let boldPattern = makeSimpleTagRegex('*');

function parseBold(text) {
  if (!text) return [];
  let markers = [];
  let match = boldPattern.exec(text);
  while (match) {
    if (match) {
      markers.push({
        content: match[1],
        index: match.index,
      });
    }
    match = boldPattern.exec(text);
  }
  return markers;
}

let underlinePattern = makeSimpleTagRegex('_');

function parseURLs(text) {
  if (!text) return [];
  let markers = [];
  let match = urlPattern.exec(text);
  while (match) {
    if (match) {
      markers.push({
        content: match[0],
        index: match.index,
      });
    }
    match = urlPattern.exec(text);
  }
  return markers;
}

function getBoldTokenHandler() {
  return {
    pattern: boldPattern,
    onMatch: function onMatch(match) {
      return {
        content: match[1],
        index: match.index,
      };
    }
  };
}


function getURLTokenHandler() {
  return {
    pattern: urlPattern,
    onMatch: function onMatch(match) {
      return {
        content: match[0],
        index: match.index,
      };
    }
  };
}

function parseTokens(text, { pattern, onMatch }) {
  if (!text || !pattern || !onMatch) return [];
  let markers = [];
  let match = pattern.exec(text);
  while (match) {
    if (match) {
      markers.push(onMatch(match));
    }
    match = pattern.exec(text);
  }
  return markers;
}

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

  markPattern(regex) {
    if (!regex) return;

    let match = regex.exec(this.normalizedText);
    while (match) {
      if (match) {
        this.markers.push({
          content: match[0],
          index: match.index,
        });
      }
      match = regex.exec(this.normalizedText);
    }
  }

  buildMarkers() {
    // this.markPattern(boldPattern);
    this.markers.push(...parseTokens(this.normalizedText, getBoldTokenHandler()));
    this.markers.push(...parseTokens(this.normalizedText, getURLTokenHandler()));
    // this.markers.push(...parseBold(this.normalizedText));
    // this.markers.push(...parseURLs(this.normalizedText));

    // this.markPattern(underlinePattern);
    // this.markPattern(urlPattern);
    console.log(this.markers);
  }

  buildTree() {
    this.buildMarkers();
  }
}

export default ParsedText;
