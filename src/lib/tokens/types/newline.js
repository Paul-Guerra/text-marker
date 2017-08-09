let pattern = new RegExp('\\n', 'g');

export default function search() {
  return {
    pattern,
    onMatch: function onMatch(match) {
      return {
        name,
        type: 'NEWLINE',
        chars: match[0],
        start: match.index,
      };
    }
  };
}
