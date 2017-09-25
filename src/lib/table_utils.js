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
  let rowAtLine = {};
  tokens.forEach((token, index, arr) => {
    if (!isTableRow(token)) {
      // if (rowEndsAtStringIndex[token.index - 1]) {
      //   tokensWithTables.push(newTableEndToken())
      // };
      tokensWithTables.push(token);
      return;
    }
    rowAtLine[token.line] = true;
    if (index === 0) {
      tokensWithTables.push(newTableStartToken({ index: token.index }));
      tokensWithTables.push(token);
      return;
    }

    if (isStartToken(token)) {
      // if the previous token was not a row end push a table start token
      if (index === 0) {
        tokensWithTables.push(newTableStartToken({ index: token.index }));
        tokensWithTables.push(token);
        return;
      }

      // let prev = arr[index - 1];
      // if (!(isTableRow(prev) && isEndToken(prev))) {
      //   tokensWithTables.push(newTableStartToken());
      //   tokensWithTables.push(token);
      // }
      if (!rowAtLine[token.index - 1]) {
        tokensWithTables.push(newTableStartToken({ index: token.index, line: token.line }));
        tokensWithTables.push(token);
        return;
      }
    }
    if (isEndToken(token)) {
      // if (index === arr.length - 1) {
      //   tokensWithTables.push(token);
      //   tokensWithTables.push(newTableEndToken());
      //   return;
      // } 
      tokensWithTables.push(token);
    }
  });
  return tokensWithTables;
}
export function xinsertTableTokens(tokens) {
  let tokensWithTables = [];
  tokens.forEach((token, index, arr) => {
    if (!isTableRow(token)) {
      tokensWithTables.push(token);
      return;
    }

    if (isStartToken(token)) {
      // if the previous token was not a row end push a table start token
      if (index === 0) {
        tokensWithTables.push(newTableStartToken());
        tokensWithTables.push(token);
        return;
      }

      let prev = arr[index - 1];
      if (!(isTableRow(prev) && isEndToken(prev))) {
        tokensWithTables.push(newTableStartToken());
        tokensWithTables.push(token);
      }
    }

    if (isEndToken(token)) {
      // if the next token was not a row start push a table end token
      if (index === arr.length - 1) {
        tokensWithTables.push(token);
        tokensWithTables.push(newTableEndToken());
        return;
      }

      let next = arr[index + 1];
      if (!(isTableRow(next) && isStartToken(next))) {
        tokensWithTables.push(token);
        tokensWithTables.push(newTableEndToken());
      }
    }
  });
  return tokensWithTables;
}

export function removeTokensBetweenTableRows(tokens) {
  let scrubbedTokens = [];
  tokens.forEach((token, index, arr) => {});
}

export function handleTableTokens(tokens) {
  let fixedTokens;
  fixedTokens = removeTokensBetweenTableRows(tokens);
  fixedTokens = insertTableTokens(fixedTokens);
}
