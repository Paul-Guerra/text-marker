import { isInTableCell, isInTableRow, isInTable } from './token_stack';
import { newTableStartToken, newTableEndToken } from './types/table';
import { isStartToken, isEndToken } from './utils';

export function isTableCell(token) { return token.name === 'TABLE_CELL'; }

export function isTableRow(token) { return token.name === 'TABLE_ROW'; }

export function isTable(token) { return token.name === 'TABLE'; }

export function isInTableFamily(token) {
  return isTableCell(token) || isTableRow(token) || isTable(token);
}

export function insertTableTokens(tokens) {
  let tokensWithTables = [];
  let tableTokenAtLine = {};
  let lastLineProcessed;
  tokens.forEach((token, index, arr) => {
    if (!isTableRow(token)) {
       
      if (
        !tableTokenAtLine[token.line] && // if the previous line had a table element
        tableTokenAtLine[token.line - 1] && // and the this line does not and
        token.line !== lastLineProcessed // and I haven't handled this line already
      ) {
        tokensWithTables.push(newTableEndToken({ index: token.index, line: token.line }));
      }
      tokensWithTables.push(token);
      lastLineProcessed = token.line;
      return;
    }
    tableTokenAtLine[token.line] = true;
    if (index === 0) {
      tokensWithTables.push(newTableStartToken({ index: token.index, line: token.line }));
      tokensWithTables.push(token);
      lastLineProcessed = token.line;
      return;
    }
    
    if (isStartToken(token)) {
      // if the previous token was not a row end push a table start token
      if (index === 0) {
        tokensWithTables.push(newTableStartToken({ index: token.index, line: token.line }));
        tokensWithTables.push(token);
        lastLineProcessed = token.line;
        return;
      }
      
      if (!tableTokenAtLine[token.line - 1]) {
        tokensWithTables.push(newTableStartToken({ index: token.index, line: token.line }));
        tokensWithTables.push(token);
        lastLineProcessed = token.line;
        return;
      }
    }
    if (isEndToken(token)) {
      tokensWithTables.push(token);
    }
    lastLineProcessed = token.line;
  });
  return tokensWithTables;
}
