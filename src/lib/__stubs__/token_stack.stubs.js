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

function* falseFalseTrue() {
  yield false;
  yield false;
  return true;
}

let lastContainsIsTrue = falseFalseTrue();

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
    contains: () => lastContainsIsTrue.next().value
  }
};
