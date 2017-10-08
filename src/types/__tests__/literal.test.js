/* global jest, describe, it, expect */
import literal from '../literal';

global.console = { error: jest.fn() };
describe('Literal tokenizer', () => {
  it('returns an object', () => {
    let newLiteral = literal('TEST', 0);
    expect(typeof newLiteral).toBe('object');
  });

  it('has a type', () => {
    let newLiteral = literal('TEST', 0);
    expect(newLiteral.type).toBe('LITERAL');
  });

  it('has a chars', () => {
    let newLiteral = literal('TEST', 0);
    expect(newLiteral.chars).toBe('TEST');
  });

  it('chars must be a string', () => {
    let newLiteral = literal(true, 0);
    expect(newLiteral).toBe(false);
  });

  it('has an index', () => {
    let newLiteral = literal('TEST', 0);
    expect(newLiteral.index).toBe(0);
  });

  it('index must be a number', () => {
    let newLiteral = literal('TEST', '0');
    expect(newLiteral).toBe(false);
  });
});
