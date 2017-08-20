import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { pattern as urlPattern, name as urlTokenName } from './lib/tokens/url';
import { pattern as newlinePattern, name as newlineTokenName } from './lib/tokens/newline';
import tableTokenizer from './lib/tokens/types/table';
import textRangeSearch from './lib/tokens/types/text_range';
import blockSearch from './lib/tokens/types/block';
import App from './components/app.component';
import lex, { printTokens } from './lib/lexer';
import stubs from './__tests__/stubs/text.stubs';

let text;
text = stubs.tables.twoColumn;
text = stubs.largeText;
window.text = text;

setTimeout(() => {
  let patterns = [
    blockSearch({ open: '*', close: '*' }, 'BOLD'),
    blockSearch({ open: '_', close: '_' }, 'UNDERLINE'),
    blockSearch({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    tableTokenizer('\t', 100),
    textRangeSearch(urlPattern, urlTokenName),
    // keywordTokenizer('/buzz', 'BUZZ'),
    textRangeSearch('yar bar', 'FIND'),
    textRangeSearch('Step 1', 'FIND'),
    textRangeSearch('bar foo', 'HIGHLIGHT'),
    textRangeSearch('foo baz', 'MARK'),
    textRangeSearch('Aenean', 'IPSUM')
  ];
  let sample = text;
  console.log('parsing ', sample.length, 'characters');
  let start;
  let end;
  let sum = 0;
  let avg;
  let tokens;
  let count = 1;
  console.profile('lex');
  // tokens = lex(sample, patterns);
  // for (let i = 0; i < count; i++) {

  start =  performance.now();
  tokens = lex(sample, patterns);
  end =  performance.now();
  sum += end - start;
  console.log('parsing time:', end - start, 'ms');
  // }
  // console.log('parsing average over',count,'times:', sum / count, 'ms');
  console.profileEnd('lex');
  console.log('tokens: ', tokens);
}, 0);


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App text={text} />,
    document.getElementById('app')
  );
});

