import boldTokenHandler from './tokenhandlers/bold';
import { pattern as urlPattern, type as urlTokenType } from './tokenhandlers/url';
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

export function findTokens(text) {
  return Array.concat(
    parseTokens(text, boldTokenHandler),
    parseTokens(text, underlineTokenHandler),
    parseTokens(text, keywordTokenHandlerFactory(urlPattern, urlTokenType)),
    parseTokens(text, keywordTokenHandlerFactory('google.com . . .  or'))
  ).sort((a, b) => a.index > b.index);
}

export function parse(text) {
  return findTokens(text);
}
