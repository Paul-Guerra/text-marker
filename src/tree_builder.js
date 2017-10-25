
export default class TreeBuilder {
  constructor() {
    this.tree = this.currentNode = { name: 'root', children: []};
    this.nodeStack = [];
  }

  tokenToLeaf(token) {
    if (!token) return false;
    return {
      name: token.name,
      attributes: token.attributes || {},      
      text: token.chars
    };
  }
  
  addLeaf(token) {
    let leaf = this.tokenToLeaf(token);
    if (leaf) this.currentNode.children.push(leaf);
  }
  
  tokenToBranch(token) {
    if (!token) return false;
    return {
      name: token.name,
      attributes: token.attributes || {},
      children: []
    };
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