
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

function flushBufferTokens(now = 'BEFORE', selector) {
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
  return tokenBuffer[type][name][now];
}

// Split tokens to eliminate any cases where they overLap
// eg. turn tokens like this <b>this is <ul>my text</b> over here</u>
//  into <b>this is <ul>my text</ul></b><u> over here</u>
// The regular expressions SHOULD be finding only block with matching
// open and close pairs so there SHOULD NOT be any dangling end blocks at this point
export function fixOverlappingBlocks(tokens) {
  let blocks = [];
  let currentBlock;
  let fixedTokens = [];
  tokens.forEach((token, index) => {
    let bufferedTokens = getTokensForIndex(index);
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
    currentBlock = blocks[blocks.length - 1] || null;

    // if the current open block token doesnt match the current end token
    if (currentBlock && token.name !== currentBlock.name) {
      // close open blocks w/ different name until you find the match
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (token.name !== blocks[i].name) {
          // create a closing token and push to fixed token 
          fixedTokens.push(
            Object.assign({}, blocks[i], { start: null, token: currentBlock.delimiters.close, type: 'BLOCK_END' })
          );
          setTokensForIndex(index + 1, Object.assign({ start: null }, blocks[i]));
          blocks.pop();
        } else {
          blocks.pop();
          break;
        }
      }
    } else {
      blocks.pop();
    }
    // everything looks good go ahead and push the token
    fixedTokens.push(token);
  });
  return fixedTokens;
}
