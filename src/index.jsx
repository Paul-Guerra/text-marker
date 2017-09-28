import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { pattern as urlPattern, name as urlTokenName } from './lib/url';
import { pattern as newlinePattern, name as newlineTokenName } from './lib/newline';
import tableTokenizer from './lib/types/table';
import tsv from './middleware/tsv';
import textRangeSearch from './lib/types/range';
import keyword from './lib/types/keyword';
import registerBlock, { makeBlockRegex } from './lib/types/block';
import App from './components/app.component';
import lex, { printTokens } from './lib/lexer';
import stubs from './lib/types/__stubs__/text.stubs';
import utilStubs from './lib/__stubs__/utils.stubs';

let text;
// text = 'foo *bar _foo* baz_';
// text = 'foo <i>*****bar*****</i> foo baz\n **bar**';
// text = stubs.tables.twoColumn;
// text = stubs.largeText + '\n' + stubs.largeText;
// text = '**foo bar\n\nfoo baz**';
// text = stubs.tables.markUpBetweenCells;
// text = stubs.markUp;
// text = '*foo bar foo baz*';
// text = utilStubs.twoRowTable.text;
// text = utilStubs.twoRowTable.text;
// text = utilStubs.blockSpansCells.text;

// text = 'not a table\nc1r1\tc2r1\nc1r2\tc2r2\nc1r3\tc2r3\nnot a table';
// text = 'c1r1\tc2r1';
// text = 'foo bar foo baz';
text = 'c1r1\tc2r1\n';
console.log(tsv(text));
window.text = text;

setTimeout(() => {
  let patterns = [
    // registerBlock({ open: '**', close: '**' }, 'BOLD'),
    // registerBlock({ open: '<i>', close: '</i>' }, 'UNDERLINE'),
    // registerBlock({ open: '_', close: '_' }, 'UNDERLINE'),
    // specialCharacter('\n', 'NEWLINE'),
    // registerBlock({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    // tableTokenizer('\t'),
    // registerBlock({ open: '[[TABLE]]', close: '[[/TABLE]]' }, 'TABLE'),
    // registerBlock({ open: '[[TABLE_ROW]]', close: '[[/TABLE_ROW]]' }, 'TABLE_ROW'),
    // registerBlock({ open: '[[TABLE_CELL]]', close: '[[/TABLE_CELL]]' }, 'TABLE_CELL'),
    // registerBlock({ open: '<i>', close: '</i>' }, 'UNDERLINE'),
    // registerBlock({ open: '_', close: '_' }, 'UNDERLINE'),
    // keyword('/buzz', 'BUZZ'),
    // keyword('*', 'AST'),
    // keyword('\n', 'NEWLINE'),
    // registerBlock({ open: '-', close: '-' }, 'STRIKETHROUGH'),
    // tableTokenizer('\t', 0),
    // textRangeSearch('bar baz', 'FIND'),
    // textRangeSearch('a', 'FIND'),
    // textRangeSearch(urlPattern, urlTokenName),
    // keywordTokenizer('/buzz', 'BUZZ'),
    // textRangeSearch('yar bar', 'FIND'),
    // textRangeSearch('bar foo', 'HIGHLIGHT'),
    textRangeSearch('foo baz', 'MARK'),
    textRangeSearch('foo', 'FIND'),
    // textRangeSearch('Aenean', 'IPSUM')
  ];
  let sample = text;
  console.log('parsing ', sample.length, 'characters');
  // lex(sample, patterns, [tsv]);
  let sum = 0;
  let tokens;
  let count = 1;
  for (let i = 0; i < count; i++) {
    // console.profile('parse');
    performance.mark('parse-start');
    // tokens = lex(sample, patterns, [tsv]);
    performance.mark('parse-end');
    // console.profileEnd('parse');
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

