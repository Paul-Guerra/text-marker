/* global jest */
export default class StubBuilder {
  constructor() {
   this.tree = {name: 'stub'}; 
  }
}
StubBuilder.prototype.addLeaf = jest.fn();
StubBuilder.prototype.startBranch = jest.fn();
StubBuilder.prototype.endBranch = jest.fn();
StubBuilder.prototype.tokenToLeaf = jest.fn();
StubBuilder.prototype.tokenToBranch = jest.fn();