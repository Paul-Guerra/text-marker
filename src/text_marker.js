import parse, { tokensToString } from './lexer';
import range from './types/range';
import keyword from './types/keyword';
import block from './types/block';
import symbol from './types/symbol';

const version = require('../package.json').version;

export default {
  parse,
  range,
  keyword,
  block,
  symbol,
  version
};
