/* global describe, it, expect, jest */
import TreeBuilder from '../tree_builder';

describe('new TreeBuilder()', () => {
  it('has a tree object', () => {
    let tb = new TreeBuilder();
    expect(typeof tb.tree).toBe('object');
    expect(tb.tree.name).toBe('root');
    expect(tb.tree.children instanceof Array).toBe(true);
    expect(tb.tree.children.length).toBe(0);
  });
  
  it('has an empty nodeStack', () => {
    let tb = new TreeBuilder();
    expect(tb.nodeStack instanceof Array).toBe(true);
    expect(tb.nodeStack.length).toBe(0);
  });
});

describe('treeBuilder.tokenToLeaf()', () => {
  it('returns a leaf using token name and chars', () => {
    let tb = new TreeBuilder();
    let leaf = tb.tokenToLeaf({ name: 'foo', chars: 'bar', attributes: 'baz' });
    expect(leaf.name).toBe('foo');
    expect(leaf.text).toBe('bar');
    expect(leaf.attributes).toBe('baz');
  });
  
  it('returns false if token is falsey', () => {
    let tb = new TreeBuilder();
    let leaf = tb.tokenToLeaf(0);
    expect(leaf).toBe(false);
  });
});

describe('treeBuilder.addLeaf()', () => {
  it('adds token to tree', () => {
    let tb = new TreeBuilder();
    tb.addLeaf({ name: 'foo', chars: 'bar' });
    expect(tb.tree.children.length).toBe(1);
  });
  
  it('does not add falsey values', () => {
    let tb = new TreeBuilder();
    tb.addLeaf(0);
    expect(tb.tree.children.length).toBe(0);
  });
});

describe('treeBuilder.tokenToBranch()', () => {
  it('returns a branch using token name', () => {
    let tb = new TreeBuilder();
    let branch = tb.tokenToBranch({ name: 'foo', attributes: 'baz' });
    expect(branch.name).toBe('foo');
    expect(branch.attributes).toBe('baz');
    expect(branch.children instanceof Array).toBe(true);
    expect(branch.children.length).toBe(0);
  });
  
  it('returns false if token is falsey', () => {
    let tb = new TreeBuilder();
    let branch = tb.tokenToBranch(0);
    expect(branch).toBe(false);
  });
});

describe('treeBuilder.startBranch()', () => {
  it('updates the stack and the current node', () => {
    let tb = new TreeBuilder();
    tb.startBranch({ name: 'foo' });
    expect(tb.currentNode.name).toBe('foo');
    expect(tb.nodeStack.length).toBe(1);
    expect(tb.nodeStack[0].name).toBe('foo');
    expect(tb.tree.children.length).toBe(1);
    expect(tb.tree.children[0].name).toBe('foo');
  });
  
  it('does nothing with falsey values', () => {
    let tb = new TreeBuilder();
    tb.startBranch(0);
    expect(tb.currentNode.name).toBe('root');
    expect(tb.nodeStack.length).toBe(0);
    expect(tb.tree.children.length).toBe(0);
  });
});

describe('treeBuilder.endBranch()', () => {
  it('pops off the nodeStack array', () => {
    let tb = new TreeBuilder();
    tb.nodeStack = ['a', 'b'];
    tb.endBranch();
    expect(tb.nodeStack.length).toBe(1);
  });
  
  it('points currentNode at new last array item', () => {
    let tb = new TreeBuilder();
    tb.nodeStack = ['a', 'b'];
    tb.endBranch();
    expect(tb.currentNode).toBe('a');
  });
  
  it('points currentNode to root if the stack is empty', () => {
    let tb = new TreeBuilder();
    tb.endBranch();
    expect(tb.currentNode).toBe(tb.tree);
  });
});