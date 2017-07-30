import { makeSimpleTagRegex } from '../utils';

const token = '*';
const pattern = makeSimpleTagRegex(token);

function onMatch(match) {
  return {
    type: 'BOLD',
    content: match[1],
    index: match.index,
  };
}

export default {
  pattern,
  onMatch
};
