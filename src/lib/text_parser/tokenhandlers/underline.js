import { makeSimpleTagRegex } from '../utils';

const token = '_';
const pattern = makeSimpleTagRegex(token);

function onMatch(match) {
  return {
    type: 'UNDERLINE',
    content: match[1],
    index: match.index,
  };
}

export default {
  pattern,
  onMatch
};
