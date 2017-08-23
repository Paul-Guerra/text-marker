export default function (seperator, priority = 100) {
  const row = new RegExp(`^.+?${seperator}.+?$`, 'gm'); // matches a row containing tab seperated values. 
  const cellsInRow = new RegExp(`[^${seperator}]+`, 'g'); // for a given row string find the cell contents
  return {
    pattern: row,
    onMatch: function onMatch(match) {
      let tokens = [
        {
          name: 'TABLE_ROW',
          type: 'RANGE_START',
          index: match.index,
          chars: null,
          handle: 'before',
          priority: (priority + 0.02) * -1,
          delimiters: { open: null, close: null }
        }
      ];
      let text = match[0];
      let cellData = cellsInRow.exec(text);
      while (cellData) {
        tokens.push(
          {
            name: 'TABLE_CELL',
            type: 'RANGE_START',
            index: cellData.index + match.index,
            chars: null,
            handle: 'before',
            priority: (priority + 0.01) * -1,
            delimiters: { open: null, close: null }
          },
          {
            name: 'TABLE_CELL',
            type: 'RANGE_END',
            index: match.index + cellData.index + cellData[0].length,
            chars: null,
            handle: 'before',
            priority: (priority + 0.01),
            delimiters: { open: null, close: null }
          }
        );
        cellData = cellsInRow.exec(text);
      }
      tokens.push({
        name: 'TABLE_ROW',
        type: 'RANGE_END',
        index: match.index + match[0].length,
        chars: null,
        handle: 'before',
        priority: (priority + 0.02),
        delimiters: { open: null, close: null }
      });

      return tokens;
    }
  };
}
