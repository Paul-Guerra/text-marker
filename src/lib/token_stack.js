export default class TokenStack {
  constructor() {
    this.stack = { all: [] };
  }

  at(index, name = 'all') {
    return this.stack[name] && this.stack[name][index];
  }

  push(token) {
    this.stack.all.push(token);
    if (this.stack[token.name] instanceof Array === false) {
      this.stack[token.name] = [];
    }
    this.stack[token.name].push(token);
  }

  pop() {
    let token = this.stack.all.pop();
    if (token) this.stack[token.name].pop();
    return token;
  }

  contains(name) {
    if (this.stack[name]) {
      if (this.stack[name].length > 0) return true;
    }
    return false;
  }

  get length() {
    return this.stack.all.length;
  }
}

export function isInTable(blocks) {
  return blocks.contains('TABLE') || blocks.contains('TABLE_ROW') || blocks.contains('TABLE_CELL');
}
