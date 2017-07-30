import { makeSimpleTagRegex } from '../utils';

const delimiters = { open: '*', close: '*' };
const pattern = makeSimpleTagRegex(delimiters);

function onMatch(match) {
  return {
    type: 'BOLD',
    content: match[1],
    index: match.index,
    delimiters
  };
}

export default {
  pattern,
  onMatch
};
