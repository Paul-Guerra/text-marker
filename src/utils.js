import TokenStack from './token_stack';

export function escapeStringForRegex(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function makeRegexOrPattern(strings) {
  if (!strings.length) return '';
  if (strings.length === 1) return strings[0];
  return strings.reduce(function(previous, current, index) {
    let output = previous;
    if (index === 1) output = escapeStringForRegex(output);
    return `${output}|${escapeStringForRegex(current)}`;
  });
}

export function setTokensForIndex(index, token, tokens) {
  let key = `${index}`;
  if (tokens[key] instanceof Array === false) tokens[key] = [];
  return tokens[key].push(token);
}

export function getTokensForIndex(index, tokens) {
  if (!tokens[`${index}`]) return [];
  return tokens[`${index}`].reverse();
}

export function updateStack(stack, token) {
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

export function handleBufferedTokens(tokens, stack, fixedTokens) {
  if (tokens.length > 0) {
    tokens.forEach((token) => {
      fixedTokens.push(token);
      updateStack(stack, token);
    });
  }
}

export function isBlock(token) {
  return token.type === 'BLOCK_START' || token.type === 'BLOCK_END';
}

export function isRange(token) {
  return token.type === 'RANGE_START' || token.type === 'RANGE_END';
}

export function isEndToken(token) {
  return token.type === 'RANGE_END' || token.type === 'BLOCK_END';
}

export function isStartToken(token) {
  return token.type === 'RANGE_START' || token.type === 'BLOCK_START';
}

export function isMatching(t1, t2) {
  if (t1.name !== t2.name) return false;

  if (
    (isStartToken(t1) && isEndToken(t2)) ||
    (isStartToken(t2) && isEndToken(t1))
  ) {
    return true;
  }

  return false;
}

export function createVirtualToken(token) {
  return Object.assign({}, token, { _virtual: true });
}

export function createMatch(token) {
  let type;
  if (isBlock(token) && isStartToken(token)) type = 'BLOCK_END';
  if (isBlock(token) && isEndToken(token)) type = 'BLOCK_START';
  if (isRange(token) && isStartToken(token)) type = 'RANGE_END';
  if (isRange(token) && isEndToken(token)) type = 'RANGE_START';
  return Object.assign({}, createVirtualToken(token), { type });
}

// Returns true if the given token end the most recent token in the stack
export function closesPreviousToken(token, stack) {
  let lastStackToken = stack.at(stack.length - 1);
  if (lastStackToken.name === token.name && isStartToken(lastStackToken) && isEndToken(token)) {
    return true;
  }
  return false;
}

export function closeOpenTokens(fixedTokens, stack) {
  // push ending tokens until we find a start
  let stackAllIndex = stack.length - 1;
  while (stack.length > 0) {
    let newMatchingToken = createMatch(stack.at(stackAllIndex));
    fixedTokens.push(newMatchingToken);
    updateStack(stack, newMatchingToken);
    stackAllIndex -= 1;
  }
}

const hasVisibleChars = /\S/;
export function isVisibleToken(token) {
  if (!token.chars) return false;
  return !!hasVisibleChars.exec(token.chars);
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
    // blocks / ranges are not allowed to span multiple table cells
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

    // at this point we know we have an ending token, that does not match the current 
    // opening token in the stak and we and are not in a table
    // push ending tokens until we find a start
    stackAllIndex = stack.length - 1;
    while (!isMatching(token, stack.at(stackAllIndex))) {
      // drop ending tokens if they are not properly nested in a table cell.
      if (stack.at(stackAllIndex).name === 'TABLE_CELL' && isStartToken(stack.at(stackAllIndex))) {
        return;
      }
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

  // if there are any open tokens still left on the stack close them
  closeOpenTokens(fixedTokens, stack);
  return fixedTokens;
}
