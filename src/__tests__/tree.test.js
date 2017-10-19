/* global describe, it, expect, jest */
import makeTree from '../tree';
import StubBuilder from '../__stubs__/tree.stubs';

describe('makeTree()', () => {
  afterEach(() => {
    StubBuilder.prototype.addLeaf.mockReset();
    StubBuilder.prototype.startBranch.mockReset();
    StubBuilder.prototype.endBranch.mockReset();
    StubBuilder.prototype.tokenToLeaf.mockReset();
    StubBuilder.prototype.tokenToBranch.mockReset();
  });

  it('returns an tree object', () => {
    let tree = makeTree([], StubBuilder);
    expect(tree.name).toBe('stub');
  });

  it('treats a LITERAL token like a leaf', () => {
    let root = makeTree([{type: 'LITERAL'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.addLeaf.mock.calls.length).toBe(1);
  });

  it('treats a KEYWORD token like a leaf', () => {
    let root = makeTree([{type: 'KEYWORD', name: 'FOO'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.addLeaf.mock.calls.length).toBe(1);
  });

  it('treats a RANGE_START token like a branch', () => {
    let root = makeTree([{type: 'RANGE_START'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.startBranch.mock.calls.length).toBe(1);
  });

  it('treats a RANGE_END token like a branch', () => {
    let root = makeTree([{type: 'RANGE_END'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.endBranch.mock.calls.length).toBe(1);
  });


  it('treats a BLOCK_START token like a branch', () => {
    let root = makeTree([{type: 'BLOCK_START'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.startBranch.mock.calls.length).toBe(1);
  });

  it('treats a BLOCK_END token like a branch', () => {
    let root = makeTree([{type: 'BLOCK_END'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.endBranch.mock.calls.length).toBe(1);
  });

  it('does nothing with unknown token types', () => {
    let root = makeTree([{type: 'FOO'}], StubBuilder);
    let sb = new StubBuilder();
    expect(sb.endBranch.mock.calls.length).toBe(0);
    expect(sb.startBranch.mock.calls.length).toBe(0);
    expect(sb.addLeaf.mock.calls.length).toBe(0);
  });
  
  it('has default tree builder class', () => {
    let root = makeTree([{type: 'LITERAL'}]);
    expect(root.name).toBe('root');
  });
});
