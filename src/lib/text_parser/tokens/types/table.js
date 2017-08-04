// export const table = /(^)(\t|$)/gm; // matches a table as an entire blow. Does not distinguish rows or cells
// export const row = /([^\n\t]+(?=\t))+[^\n]+/gm; // matches a row containing tab seperated values. 
// export const row = /[^\n\t].*\t[^\n]+/gm; // matches a row containing tab seperated values. 
// export const rowStart = /(\n)[^\t]+\t/g; // matches a row start containing tab seperated values

// export const cellsInRow = /(^.)|\t|(.$)/g; // for a given row  string find the cell delimiters


export default function (seperator) {
  // const rowStart = new RegExp(`[^\n].*${seperator}[^\n]*`, 'g'); // matches a row containing tab seperated values. 
  const rowStart = new RegExp(`${seperator}`, 'g'); // matches a row containing tab seperated values. 
  const cellsInRow = new RegExp(`[^${seperator}]+`, 'g'); // for a given row string find the cell contents
  return {
    pattern: rowStart,
    tokenizer: function tokenizer(match) {
      let tokens = [
        {
          name: 'TABLE_ROW_START',
          type: 'BLOCK_START',
          start: match.index,
          chars: null,
          delimiters: { open: null, close: null }
        }
      ];
      let text = match[0];
      let cellData = cellsInRow.exec(text);
      while (cellData) {
        tokens.push(
          {
            name: 'TABLE_CELL_START',
            type: 'BLOCK_START',
            start: cellData.index + match.index,
            chars: null,
            delimiters: { open: null, close: null }
          },
          {
            name: 'TABLE_CELL_END',
            type: 'BLOCK_END',
            start: match.index + cellData.index + cellData[0].length,
            chars: null,
            delimiters: { open: null, close: null }
          }
        );
        cellData = cellsInRow.exec(text);
      }
      tokens.push({
        name: 'TABLE_ROW_END',
        type: 'BLOCK_END',
        start: match.index + match[0].length,
        chars: null,
        delimiters: { open: null, close: null }
      });
      return tokens;
    }
  };
}
