function makeRowPattern(seperator) {
  return `^.+?${seperator}.+?$`;
}

function makeCellPattern(seperator) {
  return `[^${seperator}]+`;
}

export default function (seperator, priority = 100) {
  const row = new RegExp(makeRowPattern(seperator), 'gm'); // matches a row containing tab seperated values. 
  const cellsInRow = new RegExp(makeCellPattern(seperator), 'g'); // for a given row string find the cell contents
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
            chars: seperator,
            handle: 'before',
            priority: (priority + 0.01) * -1,
            delimiters: { open: null, close: null }
          },
          // {
          //   name: 'TABLE_SEP_VALUE',
          //   type: 'SPECIAL_CHAR',
          //   chars: seperator,
          //   index: match.index + cellData.index + cellData[0].length,
          //   priority,
          //   handle: 'at',
          // },
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
      },
      {
        name: 'TABLE_TEST',
        type: 'SPECIAL_CHAR',
        chars: '\n',
        index: match.index + match[0].length,
        priority,
        handle: 'at',
      }
      );

      return tokens;
    }
  };
}

const rowStart = '[[TABLE_ROW]]';
const rowEnd = '[[/TABLE_ROW]]';

const cellStart = '[[TABLE_CELL]]';
const cellEnd = '[[/TABLE_CELL]]';
export function middleware(seperator, text) {
  if (!seperator) return text;
  if (text.indexOf(seperator) === -1) return text;
  let result;
  let lines = text.split('\n');
  let tabPattern = /\t/g;
  result = lines.map((line, index, arr) => {
    let match = tabPattern.exec(line);
    let newLine = '';
    let lastMatchIndex = 0;
    if (!match) return line;
    while (match) {
      newLine += cellStart + line.substr(lastMatchIndex, match.index) + cellEnd;
      lastMatchIndex = match.index;
      match = tabPattern.exec(line);
    }
    return rowStart + newLine + rowEnd;
  });
  return result.join('\n');
}

export function newTableStartToken(props) {
  return Object.assign({}, { name: 'TABLE', type: 'RANGE_START' }, props);
}

export function newTableEndToken(props) {
  return Object.assign({}, { name: 'TABLE', type: 'RANGE_END' }, props);
}
