import TokenStack, { isInTable } from './token_stack';

// buffer for tokens waiting to be inserted when lexer is fixing overlapping tokens
let tokensForIndex = {};

export function setTokensForIndex(index, token) {
  let key = `${index}`;
  if (tokensForIndex[key] instanceof Array === false) tokensForIndex[key] = [];
  tokensForIndex[key].push(token);
}

export function getTokensForIndex(index) {
  if (!tokensForIndex[`${index}`]) return [];
  return tokensForIndex[`${index}`].reverse();
}
let tokenBuffer = { indexes: {} };

function bufferTokenFor(when = 'BEFORE', selector, token) {
  let index = `${selector.index}`;
  let { type, name } = selector;

  if (!token) {
    console.warn('No token. Bailing.');
    return;
  }
  if (!name && !type && !index) {
    console.warn('Cannot buffer a token without a name and type or index property. Bailing.');
    return;
  }
  if (index) {
    if (!tokenBuffer.indexes[index]) tokenBuffer.indexes[index] = {};
    if (tokenBuffer.indexes[index][when] instanceof Array === false) {
      tokenBuffer.indexes[index][when] = [];
    }
    tokenBuffer.indexes[index][when].push(token);
    return;
  }

  if (!tokenBuffer[type]) tokenBuffer[type] = {};
  if (!tokenBuffer[type][name]) tokenBuffer[type][name] = {};
  if (tokenBuffer[type][name][when] instanceof Array === false) tokenBuffer[type][name][when] = [];
  tokenBuffer[type][name][when].push(token);
}


function getBufferTokens(now = 'BEFORE', selector) {
  let index = `${selector.index}`;
  let { type, name } = selector;
  if (!name && !type && !index) {
    console.warn('Cannot flush buffer without a name and type or index property. Bailing.');
    return [];
  }
  if (index) {
    if (!tokenBuffer.indexes[index]) tokenBuffer.indexes[index] = {};
    if (tokenBuffer.indexes[index][now] instanceof Array === false) {
      tokenBuffer.indexes[index][now] = [];
    }
    return tokenBuffer.indexes[index][now].reverse();
  }

  if (!(tokenBuffer[type] && tokenBuffer[type][name])) {
    return [];
  }
  return tokenBuffer[type][name][now] || [];
}

function flushBufferTokens(now = 'BEFORE', token, index) {
  let indexBuffer = getBufferTokens(now, { index });
  let typeBuffer = getBufferTokens(now, { name: token.name, type: token.type });
  return Array.concat(typeBuffer, indexBuffer);
}

/**
 * Split delimiters to eliminate any cases where they overLap
 * eg. turn tokens like this <b>BOLD<ul>BOLD AND UNDERLINE</b>UNDERLINE</u>
 * into <b>BOLD<ul>BOLD AND UNDERLINE</ul></b><u>UNDERLINE</u>
 * The regular expressions SHOULD be finding only block with matching
 * open and close pairs so there SHOULD NOT be any dangling end blocks at this point
 * 
 * Tables are a special case. In the event that delimiters overlap table cells 
 * the currently open delimiters started in a cell will be given artifical closing delimiters. 
 * in the same cell. The original closing tag, when found will be dropped.
 */
export function parseBlocks(tokens) {
  let blocks = new TokenStack();
  let currentBlock;
  let fixedTokens = [];
  tokens.forEach((token, index) => {
    let bufferedTokens = getTokensForIndex(index);
    // let bufferedTokens = flushBufferTokens('BEFORE', token, index);
    if (bufferedTokens.length > 0) {
      fixedTokens.push(...bufferedTokens);
    }
    if (token.type !== 'BLOCK_END') {
      if (token.type === 'BLOCK_START') {
        blocks.push(token);
      }
      fixedTokens.push(token);
      return;
    }

    // At this point we have ruled out all types except BLOCK_END
    currentBlock = blocks.at(blocks.length - 1) || null;

    // if the current open block token doesnt match the current end token
    if (currentBlock && token.name !== currentBlock.name) {
      // close open blocks w/ different name until you find the match
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (token.name !== blocks.at(i).name) {
          // Tables will not try to completely match overlapping tokens between cells. 
          // When overlapping tokens are found in a table just close the blocks in the current cell
          // Do not create fake tokens to be inserted later
          if (!isInTable(blocks)) {
            // create a closing token and push to fixed tokens
            // if (blocks.at(i).name !== 'TABLE_ROW' && blocks.at(i).name !== 'TABLE'){}
            fixedTokens.push(
              Object.assign(
                {},
                blocks.at(i),
                { start: null, token: currentBlock.delimiters.close, type: 'BLOCK_END' })
            );
            setTokensForIndex(
              index + 1,
              Object.assign({}, blocks.at(i), { start: null })
            );
          } else {
            // if we are closing a table cell then push the new closing tokens
            if (token.name === 'TABLE_CELL' && token.type === 'BLOCK_END') {
              fixedTokens.push(
                Object.assign(
                  {},
                  blocks.at(i),
                  { start: null, token: currentBlock.delimiters.close, type: 'BLOCK_END' })
              );
            } else {
              // we are an unmatched END delimiter in a table. Bail.
              return;
            }
          }
          blocks.pop();
        } else {
          // found the matching delimeter. update the block stack and move on
          blocks.pop();
          break;
        }
      } // end for loop
    } else {
      if (!currentBlock) {
        let prevFixedToken = fixedTokens[fixedTokens.length - 1];
        // we are an unmatched END delimiter NOT in a table and our fixed token is not waiting for us. Bail.
        if (!(prevFixedToken.name === token.name && prevFixedToken.type === 'BLOCK_START')) return;
      }
      // we are the matching close block token to the current open block token
      blocks.pop();
    }
    // everything looks good go ahead and push the token
    fixedTokens.push(token);

    // bufferedTokens = flushBufferTokens('AFTER', { index });
    // if (bufferedTokens.length > 0) {
    //   fixedTokens.push(...bufferedTokens);
    // }
  });
  return fixedTokens;
}
