import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { pattern as urlPattern, name as urlTokenName } from './lib/url';
import { pattern as newlinePattern, name as newlineTokenName } from './lib/newline';
import tableTokenizer from './lib/types/table';
import textRangeSearch from './lib/types/text_range';
import blockSearch from './lib/types/block';
import App from './components/app.component';
import lex, { printTokens } from './lib/lexer';
import stubs from './lib/types/__stubs__/text.stubs';

let text;
text = stubs.tables.twoColumn;
text = stubs.largeText;
text = stubs.tables.markUpBetweenCells;
text = stubs.markUp;
text = '**foo bar foo baz**';
window.text = text;

setTimeout(() => {
  let patterns = [
    blockSearch({ open: '*', close: '*' }, 'BOLD'),
    // blockSearch({ open: '_', close: '_' }, 'UNDERLINE'),
    // blockSearch({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    // tableTokenizer('\t', 100),
    // textRangeSearch(urlPattern, urlTokenName),
    // keywordTokenizer('/buzz', 'BUZZ'),
    // textRangeSearch('yar bar', 'FIND'),
    // textRangeSearch('Step 1', 'FIND'),
    // textRangeSearch('bar foo', 'HIGHLIGHT'),
    // textRangeSearch('foo baz', 'MARK'),
    // textRangeSearch('Aenean', 'IPSUM')
  ];
  let sample = text;
  console.log('parsing ', sample.length, 'characters');
  let sum = 0;
  let tokens;
  let count = 5;
  for (let i = 0; i < count; i++) {
    console.profile('parse');
    performance.mark('parse-start');
    tokens = lex(sample, patterns);
    performance.mark('parse-end');
    console.profileEnd('parse');
    performance.measure('parse', 'parse-start', 'parse-end');
  }
  performance.getEntriesByName('parse').forEach((timing) => {
    sum += timing.duration;
  });
  console.log('parsing average over', count, 'times:', sum / count, 'ms');
  console.log('tokens: ', tokens);
}, 0);


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App text={text} />,
    document.getElementById('app')
  );
});

