export const pattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/gim;
export const type = 'URL';

function onMatch(match) {
  return {
    type,
    content: match[0],
    index: match.index,
  };
}

export default {
  pattern,
  onMatch
};
