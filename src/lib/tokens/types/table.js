export default function (seperator, priority = 100) {
  const seperatorValue = new RegExp(`${seperator}`, 'g'); // matches a row containing tab seperated values. 
  return {
    pattern: seperatorValue,
    onMatch: function onMatch(match) {
      return {
        name: 'TABLE_SEPERATOR',
        type: 'TABLE',
        index: match.index,
        chars: match[0],
        priority: (priority + 0.03) * -1,
        handle: 'at'
      };
    }
  };
}
