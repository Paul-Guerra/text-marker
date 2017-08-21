// export const table = /(^)(\t|$)/gm; // matches a table as an entire blow. Does not distinguish rows or cells
// export const row = /([^\n\t]+(?=\t))+[^\n]+/gm; // matches a row containing tab seperated values. 
// export const row = /[^\n\t].*\t[^\n]+/gm; // matches a row containing tab seperated values. 
// export const rowStart = /(\n)[^\t]+\t/g; // matches a row start containing tab seperated values
// export const cellsInRow = /(^.)|\t|(.$)/g; // for a given row  string find the cell delimiters


// const rowStart = new RegExp(`.+${seperator}.+`, 'g'); // matches a row containing tab seperated values. 
// const cellsInRow = new RegExp(`[^${seperator}]+`, 'g'); // for a given row string find the cell contents

export default function (seperator, priority = 100) {
// const seperatorValue = new RegExp(`${seperator}`, 'g'); // matches a row containing tab seperated values. 
// const seperatorValue = new RegExp(`^.+?${seperator}.+?$`, 'gm'); // matches a row containing tab seperated values. 

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
