import boldTokenHandler from './tokenhandlers/bold';
import urlTokenHandler from './tokenhandlers/url';
import underlineTokenHandler from './tokenhandlers/underline';

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
    this.markers.push(...parseTokens(this.normalizedText, boldTokenHandler));
    this.markers.push(...parseTokens(this.normalizedText, urlTokenHandler));
    this.markers.push(...parseTokens(this.normalizedText, underlineTokenHandler));
    console.log('markers', this.markers);
    // this.markers.push(...parseBold(this.normalizedText));
    // this.markers.push(...parseURLs(this.normalizedText));

    // this.markPattern(underlinePattern);
    // this.markPattern(urlPattern);
  }

  buildTree() {
    this.buildMarkers();
  }

  parse() {
    this.buildTree();
  }
}

export default ParsedText;
