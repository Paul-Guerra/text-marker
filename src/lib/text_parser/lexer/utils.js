
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

// Split tokens to eliminate any cases where they overLap
// eg. turn tokens like this <b>this is <ul>my text</b> over here</u>
//  into <b>this is <ul>my text</ul></b><u> over here</u>
// The regular expressions SHOULD be finding only block with matching
// open and close pairs so there SHOULD NOT be any dangling end blocks, etc
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

    // At this point we have rules out all types except BLOCK_END
    currentBlock = blocks[blocks.length - 1] || null;

    // if the current open block token doesnt match the current end token
    if (currentBlock && token.name !== currentBlock.name) {
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
