import TokenStack, { isInTable } from './token_stack';

export function setTokensForIndex(index, token, tokens) {
  let key = `${index}`;
  if (tokens[key] instanceof Array === false) tokens[key] = [];
  return tokens[key].push(token);
}

export function getTokensForIndex(index, tokens) {
  if (!tokens[`${index}`]) return [];
  return tokens[`${index}`].reverse();
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

  let tokensForIndex = {}; // buffer for tokens waiting to be inserted 
  let blocks = new TokenStack();
  let currentBlock;
  let fixedTokens = [];
  tokens.forEach((token, index) => {
    let bufferedTokens = getTokensForIndex(index, tokensForIndex);
    // let bufferedTokens = flushBufferTokens('BEFORE', token, index);
    if (bufferedTokens.length > 0) {
      bufferedTokens.forEach((bufferedToken) => {
        if (bufferedToken.type === 'BLOCK_START') {
          blocks.push(bufferedToken);
        }
        if (bufferedToken.type === 'BLOCK_END') {
          blocks.pop();
        }
        fixedTokens.push(bufferedToken);
      });
      // fixedTokens.push(...bufferedTokens);
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
              Object.assign({}, blocks.at(i), { start: null }),
              tokensForIndex
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
        // we are an unmatched END delimiter NOT in a table and 
        // our fixed token is not waiting for us. Bail.
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
