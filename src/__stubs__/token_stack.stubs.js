/* global jest */
const fooToken = { name: 'foo' };
const barToken = { name: 'bar' };

function newPopTestStack() {
  return {
    all: [fooToken, barToken],
    foo: [fooToken],
    bar: [barToken],
  };
}

export default {
  foo: fooToken,
  bar: barToken,
  indexesAtFoo: [1, 2],
  newPopTestStack,
  emptyPopTest: {
    all: { pop: () => undefined },
    foo: { pop: jest.fn() }
  },
  pushToExisting: {
    all: [],
    foo: []
  },
  isInTableBlocks: {
    contains: jest.fn()
  }
};
