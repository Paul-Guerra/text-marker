const pattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/gim;

function onMatch(match) {
  return {
    type: 'URL',
    content: match[0],
    index: match.index,
  };
}

export default {
  pattern,
  onMatch
};
