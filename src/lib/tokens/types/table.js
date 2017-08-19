// export const table = /(^)(\t|$)/gm; // matches a table as an entire blow. Does not distinguish rows or cells
// export const row = /([^\n\t]+(?=\t))+[^\n]+/gm; // matches a row containing tab seperated values. 
// export const row = /[^\n\t].*\t[^\n]+/gm; // matches a row containing tab seperated values. 
// export const rowStart = /(\n)[^\t]+\t/g; // matches a row start containing tab seperated values
// export const cellsInRow = /(^.)|\t|(.$)/g; // for a given row  string find the cell delimiters


// const rowStart = new RegExp(`.+${seperator}.+`, 'g'); // matches a row containing tab seperated values. 
// const cellsInRow = new RegExp(`[^${seperator}]+`, 'g'); // for a given row string find the cell contents

export default function (seperator, priority = 100) {
  // const seperatorValue = new RegExp(`${seperator}`, 'g'); // matches a row containing tab seperated values. 
  const seperatorValue = new RegExp(`^.+?${seperator}.+?$`, 'gm'); // matches a row containing tab seperated values. 
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
