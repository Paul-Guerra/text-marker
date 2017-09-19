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
      fixedTokens.push(token);
      updateStack(stack, token);
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

function closeOpenTokens(fixedTokens, stack) {
  // push ending tokens until we find a start
  let stackAllIndex = stack.length - 1;
  while (stack.length > 0) {
    // newMatchingToken = createMatch(token);
    let newMatchingToken = createMatch(stack.at(stackAllIndex));
    fixedTokens.push(newMatchingToken);
    updateStack(stack, newMatchingToken);
    // buffer starting tokens to be pushed for the next index
    stackAllIndex -= 1;
  }
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
        newMatchingToken = createMatch(stack.at(stackAllIndex));
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
      if (stack.at(stackAllIndex).name === 'TABLE_CELL' && isStartToken(stack.at(stackAllIndex))) {
        return;
      }
      // newMatchingToken = createMatch(token);
      newMatchingToken = createMatch(stack.at(stackAllIndex));
      setTokensForIndex(index + 1, createVirtualToken(stack.at(stackAllIndex)), tokensForIndex);
      fixedTokens.push(newMatchingToken);
      updateStack(stack, newMatchingToken);
      // buffer starting tokens to be pushed for the next index
      stackAllIndex -= 1;
    }
    fixedTokens.push(token);
    updateStack(stack, token);
  });

  // if there are any open tokens still left on the tack close them
  closeOpenTokens(fixedTokens, stack);
  return fixedTokens;
}
