import { pattern as urlPattern, type as urlTokenType } from './tokenhandlers/url';
import keywordTokenHandlerFactory from './tokenhandlers/keyword';
import tagTokenHandlerFactory from './tokenhandlers/tag';

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
    parseTokens(text, tagTokenHandlerFactory({ open: '*', close: '*' }, 'BOLD')),
    parseTokens(text, tagTokenHandlerFactory({ open: '_', close: '_' }, 'UNDERLINE')),
    parseTokens(text, keywordTokenHandlerFactory(urlPattern, urlTokenType)),
    parseTokens(text, keywordTokenHandlerFactory('google.com . . .  or'))
  ).sort((a, b) => a.index > b.index);
}

export function parse(text) {
  return findTokens(text);
}
