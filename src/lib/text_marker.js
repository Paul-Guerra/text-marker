import 'babel-polyfill';
import parse, { tokensToString } from './lexer';
import range from './types/range';
import keyword from './types/keyword';
import block from './types/block';
import tsv from '../middleware/tsv';

const version = require('../../package.json').version;

export default {
  parse,
  range,
  keyword,
  block,
  middleware: { tsv },
  tokensToString,
  version
};
