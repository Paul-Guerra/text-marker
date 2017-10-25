
export default class TreeBuilder {
  constructor() {
    this.tree = this.currentNode = { name: 'root', children: []};
    this.nodeStack = [];
  }

  tokenToLeaf(token) {
    if (!token) return false;
    let leaf = {
      name: token.name,  
      text: token.chars
    };

    if (token.attributes) {
      leaf.attributes = token.attributes;
    }

    return leaf;
  }
  
  addLeaf(token) {
    let leaf = this.tokenToLeaf(token);
    if (leaf) this.currentNode.children.push(leaf);
  }
  
  tokenToBranch(token) {
    if (!token) return false;
    let branch = {
      name: token.name,
      children: []
    };

    if (token.attributes) {
      branch.attributes = token.attributes;
    }

    return branch;
  }

  startBranch(token) {
    let branch = this.tokenToBranch(token);
    if (!branch) return;
    this.currentNode.children.push(branch);
    this.currentNode = branch;
    this.nodeStack.push(branch);
  }

  endBranch() {
    this.nodeStack.pop();
    this.currentNode = this.nodeStack[this.nodeStack.length - 1];
    if (!this.currentNode) this.currentNode = this.tree;
  }

}