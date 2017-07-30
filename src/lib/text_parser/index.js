import boldTokenHandler from './tokenhandlers/bold';
import urlTokenHandler from './tokenhandlers/url';
import underlineTokenHandler from './tokenhandlers/underline';
import keywordTokenHandlerFactory from './tokenhandlers/keyword';

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
    this.tree = {};
    this.markers = [];
  }

  buildMarkers() {
    this.markers = Array.concat(
      parseTokens(this.normalizedText, boldTokenHandler),
      parseTokens(this.normalizedText, urlTokenHandler),
      parseTokens(this.normalizedText, underlineTokenHandler),
      parseTokens(this.normalizedText, keywordTokenHandlerFactory('google.com . . .  or'))
    );
    this.markers.sort((a, b) => a.index > b.index);
    console.log('markers', this.markers);
  }

  buildTree() {
    this.buildMarkers();
  }

  parse() {
    this.buildTree();
  }
}

export default ParsedText;
