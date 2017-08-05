export default class TokenStack {
  constructor() {
    this.stack = { all: [] };
  }

  at(index, name = 'all') {
    return this.stack[name] && this.stack[name][index];
  }

  push(block) {
    this.stack.all.push(block);
    if (this.stack[block.name] instanceof Array === false) {
      this.stack[block.name] = [];
    }
    this.stack[block.name].push(block);
  }

  pop() {
    let block = this.stack.all.pop();
    if (block) this.stack[block.name].pop();
    return block;
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
