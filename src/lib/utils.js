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

function updateStack(stack, token) {
  // todo: add check to handle dangling end token
  switch (token.type) {
    case 'BLOCK_END':
      stack.pop();
      break;
    case 'RANGE_END':
      stack.pop();
      break;
    case 'BLOCK_START':
      stack.push(token);
      break;
    case 'RANGE_START':
      stack.push(token);
      break;
    default:
      break;
  }
}

function handleBufferedTokens(tokens, stack, fixedTokens) {
  if (tokens.length > 0) {
    tokens.forEach((token) => {
      updateStack(stack, token);
      fixedTokens.push(token);
    });
  }
}

function isBlock(token) {
  return token.type === 'BLOCK_START' || token.type === 'BLOCK_END';
}

function isRange(token) {
  return token.type === 'RANGE_START' || token.type === 'RANGE_END';
}

function isEndToken(token) {
  return token.type === 'RANGE_END' || token.type === 'BLOCK_END';
}

function isStartToken(token) {
  return token.type === 'RANGE_START' || token.type === 'BLOCK_START';
}

function isMatching(t1, t2) {
  if (t1.name !== t2.name) return false;

  if (
    (isStartToken(t1) && isEndToken(t2)) ||
    (isStartToken(t2) && isEndToken(t1))
  ) {
    return true;
  }

  return false;
}

function createVirtualToken(token) {
  return Object.assign({}, token, { _virtual: true });
}

function createMatch(token) {
  let type;
  if (isBlock(token) && isStartToken(token)) type = 'BLOCK_END';
  if (isBlock(token) && isEndToken(token)) type = 'BLOCK_START';
  if (isRange(token) && isStartToken(token)) type = 'RANGE_END';
  if (isRange(token) && isEndToken(token)) type = 'RANGE_START';
  return Object.assign({}, createVirtualToken(token), { type });
}

// Returns true if the given token end the most recent token in the stack
function closesPreviousToken(token, stack) {
  let lastStackToken = stack.at(stack.length - 1);
  // if (!lastStackToken) return false;
  if (lastStackToken.name === token.name && isStartToken(lastStackToken) && isEndToken(token)) {
    return true;
  }
  return false;
}

export function normalize(tokens) {
  let tokensForIndex = {}; // buffer for tokens waiting to be inserted 
  let stack = new TokenStack();
  let newMatchingToken;
  let fixedTokens = [];
  let stackAllIndex;
  tokens.forEach((token, index) => {
    let bufferedTokens = getTokensForIndex(index, tokensForIndex);
    handleBufferedTokens(bufferedTokens, stack, fixedTokens);
    if (!isEndToken(token)) {
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // At this point we know we are dealing with a block or range ending token

    // The happy path. This ending token matches the opening token
    if (closesPreviousToken(token, stack)) {
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // if there can be no matching start token dont add to fixed tokens. 
    if (!stack.contains(token.name)) {
      return;
    }

    // if closing a table cell close any open tokens
    if (token.name === 'TABLE_CELL') {
      // push ending tokens until we find a TABLE_CELL start
      stackAllIndex = stack.length - 1;
      while (!isMatching(token, stack.at(stackAllIndex))) {
        newMatchingToken = createMatch(token);
        fixedTokens.push(newMatchingToken);
        updateStack(stack, newMatchingToken);
        stackAllIndex -= 1;
      }
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // push ending tokens until we find a start
    stackAllIndex = stack.length - 1;
    while (!isMatching(token, stack.at(stackAllIndex))) {
      // newMatchingToken = createMatch(token);
      newMatchingToken = createMatch(stack.at(stackAllIndex));
      fixedTokens.push(newMatchingToken);
      setTokensForIndex(index + 1, createVirtualToken(stack.at(stackAllIndex)), tokensForIndex);
      updateStack(stack, newMatchingToken);
      // buffer starting tokens to be pushed for the next index
      stackAllIndex -= 1;
    }
    fixedTokens.push(token);
    updateStack(stack, token);
  });
  return fixedTokens;
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
                  { start: null, token: currentBlock.delimiters.close, type: 'BLOCK_END' }
                )
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
  });
  return fixedTokens;
}
