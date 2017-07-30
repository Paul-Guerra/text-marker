import { makeSimpleTagRegex } from '../utils';

const delimiters = { open: '_', close: '_' };
const pattern = makeSimpleTagRegex(delimiters);

function onMatch(match) {
  return {
    type: 'UNDERLINE',
    content: match[1],
    index: match.index,
    delimiters
  };
}

export default {
  pattern,
  onMatch
};
