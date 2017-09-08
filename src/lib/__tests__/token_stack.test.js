/* global describe, it, expect, jest */
import TokenStack, { isInTable } from '../token_stack';
import stubs from '../__stubs__/token_stack.stubs';

describe('new TokenStack()', () => {
  it('returns an object with a stack property', () => {
    let ts = new TokenStack();
    expect(typeof ts.stack).toBe('object');
  });
});

describe('TokenStack.stack', () => {
  it('has an empty "all" array', () => {
    let ts = new TokenStack();
    expect(ts.stack.all instanceof Array).toBe(true);
    expect(ts.stack.all.length).toBe(0);
  });
});

describe('TokenStack.at()', () => {
  it('returns value if index exists at for stack name', () => {
    let ts = new TokenStack();
    let name = 'foo';
    ts.stack[name] = stubs.indexesAtFoo;
    expect(ts.at(0, name)).toBe(1);
  });
  it('assumes the "all" stack if name is not specified', () => {
    let ts = new TokenStack();
    ts.stack.all = ['foo'];
    expect(ts.at(0)).toBe('foo');
  });

  it('returns undefined if index does not exist at for stack name', () => {
    let ts = new TokenStack();
    let name = 'foo';
    ts.stack[name] = stubs.indexesAtFoo;
    expect(ts.at(100, name)).toBe(undefined);
  });

  it('returns undefined if index does not exist at for stack name', () => {
    let ts = new TokenStack();
    let name = 'foo';
    ts.stack[name] = stubs.indexesAtFoo;
    expect(ts.at(0, 'bar')).toBe(undefined);
  });
});

describe('TokenStack.push()', () => {
  it('pushes to this.stack.all array', () => {
    let ts = new TokenStack();
    ts.push(stubs.foo);
    expect(ts.stack.all.length).toBe(1);
  });

  it('creates a new array based on the token name', () => {
    let ts = new TokenStack();
    ts.push(stubs.foo);
    expect(ts.stack.foo.length).toBe(1);
  });

  it('appends to existing array based on the token name', () => {
    let ts = new TokenStack();
    ts.stack = stubs.pushToExisting;
    ts.push(stubs.foo);
    expect(ts.stack.foo.length).toBe(1);
  });
});


describe('TokenStack.pop()', () => {
  it('pops from this.stack.all array', () => {
    let ts = new TokenStack();
    ts.stack = stubs.newPopTestStack();
    expect(ts.stack.all.length).toBe(2);
    ts.pop();
    expect(ts.stack.all.length).toBe(1);
  });

  it('pops from the stack property of the same name', () => {
    let ts = new TokenStack();
    let foo = { name: 'foo' };
    let bar = { name: 'bar' };
    ts.stack = {
      all: [foo, bar],
      foo: [foo],
      bar: [bar],
    };
    ts.stack = stubs.newPopTestStack();
    let last = ts.pop();
    expect(ts.stack.bar.length).toBe(0);
    expect(last).toBe(stubs.bar);
    // expect(last).toBe(bar);
  });

  it('only pops from the stack property of the same name if it exists', () => {
    let ts = new TokenStack();
    ts.stack = stubs.emptyPopTest;
    ts.pop();
    expect(ts.stack.foo.pop).not.toBeCalled();
  });
});

describe('TokenStack.contains()', () => {
  it('returns false if the stack property does not exist', () => {
    let ts = new TokenStack();
    expect(ts.contains('foo')).toBe(false);
  });

  it('returns false if the stack property is an empty array', () => {
    let ts = new TokenStack();
    ts.stack.foo = [];
    expect(ts.contains('foo')).toBe(false);
  });

  it('returns true if the stack property is a non-empty array', () => {
    let ts = new TokenStack();
    ts.stack.foo = [1];
    expect(ts.contains('foo')).toBe(true);
  });
});

describe('TokenStack.length', () => {
  it('matches the length of the stack.all array', () => {
    let ts = new TokenStack();
    ts.stack.all = [1, 2, 3, 4, 5];
    expect(ts.length).toBe(5);
  });
});


describe('TokenStack.isInTable', () => {
  it('returns true if at least one condition is satified', () => {
    expect(isInTable(stubs.isInTableBlocks)).toBe(true);
  });
});
