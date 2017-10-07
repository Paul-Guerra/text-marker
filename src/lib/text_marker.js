import 'babel-polyfill';
import parse, { tokensToString } from './lexer';
import range from './types/range';
import keyword from './types/keyword';
import block from './types/block';

const version = require('../../package.json').version;

export default {
  parse,
  tokensToString,
  range,
  keyword,
  block,
  version
};
