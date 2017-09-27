
const tableStart = '[[TABLE]]';
const tableEnd = '[[/TABLE]]';
const rowStart = '[[TABLE_ROW]]';
const rowEnd = '[[/TABLE_ROW]]';
const cellStart = '[[TABLE_CELL]]';
const cellEnd = '[[/TABLE_CELL]]';

export const tsvPlaceholderText = {
  tableStart,
  tableEnd,
  rowStart,
  rowEnd,
  cellStart,
  cellEnd
};

export default function tsv(text) {
  if (text.indexOf('\t') === -1) return text;
  let result;
  let lines = text.split('\n');
  let tabPattern = /\t/g;
  let cellPattern = /[^\t]+/g;
  let inTable = false;
  result = lines.map((line, index, arr) => {
    if (!tabPattern.exec(line)) {
      if (inTable) {
        inTable = false;
        return tableEnd + line;
      }
      return line;
    }
    let newLine = '';
    let match = cellPattern.exec(line);
    while (match) {
      newLine += cellStart + match[0] + cellEnd;
      match = cellPattern.exec(line);
    }
    newLine = rowStart + newLine + rowEnd;
    if (!inTable) {
      newLine = tableStart + newLine;
      inTable = true;
    }
    return newLine;
  });
  console.log('tsv', result.join('\n'));
  return result.join('\n');
}
