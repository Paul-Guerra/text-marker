/* global jest, describe, it, expect */
import symbol from '../symbol';
import stubs from '../__stubs__/symbol.stubs';

global.console = { error: jest.fn() };

describe('symbol()', () => {
  it('returns an object', () => {
    let result = symbol('TEST', 'NAME');
    expect(typeof result).toBe('object');
  });
  
  it('accepts a regex as an argument', () => {
    let dummyRegex = /hello/;
    let result = symbol(dummyRegex, 'NAME');
    expect(result.pattern).toBe(dummyRegex);
  });

  it('accepts an array of strings an argument', () => {
    let strings = ['foo, barr'];
    let result = symbol(strings, 'NAME');
    expect(typeof result).toBe('object');    
  });
    
  it('it returns false if it cannot create a pattern', () => {
    let result = symbol(0, 'NAME');
    expect(result).toBe(false);
  });
});

describe('symbol().pattern', () => {
  it('exists', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern).toBeTruthy();
  });

  it('is a regex', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern instanceof RegExp).toBe(true);
  });

  it('has gi flags', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.flags).toBe('gi');
  });
  
  it('matches the symbol with a preceeding space', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.exec('spaces before TEST')).toBeTruthy();
  });

  it('matches the symbol with a following space', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.exec('TEST spaces after')).toBeTruthy();
  });

  it('matches trimmed symbol', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.exec('TEST spaces after')).toBeTruthy();
  });

  it('matches the symbol surounded by spaces', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.exec('TEST')).toBeTruthy();
  });

  it('matches the symbol when embedded in another word', () => {
    let {pattern} = symbol('TEST', 'NAME');
    expect(pattern.exec('FOOTESTBAR')).toBeTruthy();
  });
  
  it('can detect more than one symbol', () => {
    let strings = ['foo', 'bar'];
    let {pattern} = symbol(strings, 'NAME');    
    expect(pattern.exec('aaa foo bbb bar').index).toBe(4);
    expect(pattern.exec('aaa foo bbb bar').index).toBe(12);
  });
});


describe('symbol().onMatch', () => {
  it('exists', () => {
    let result = symbol('TEST', 'NAME');
    expect(result.onMatch).toBeTruthy();
  });

  it('is a function', () => {
    let result = symbol('TEST', 'NAME');
    expect(typeof result.onMatch).toBe('function');
  });

  it('returns an object', () => {
    let result = symbol('TEST', 'NAME');
    expect(typeof result.onMatch(stubs.matchResult)).toBe('object');
  });

  it('uses name provided', () => {
    let result = symbol('TEST', 'FOO').onMatch(stubs.matchResult);
    let name = result.name;
    expect(name).toBe('FOO');
  });

  it('has type \'SYMBOL\'', () => {
    let result = symbol('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.type).toBe('SYMBOL');
  });

  it('has chars string that matches 2nd regex group', () => {
    let rule = symbol('TEST', 'NAME');
    let result = rule.onMatch(stubs.matchResult);
    expect(result.chars).toBe(stubs.matchResult[0]);
  });

  it('has an index', () => {
    let result = symbol('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.index).toBe(18);
  });

  it('handle is  \'at\'', () => {
    let result = symbol('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.handle).toBe('at');
  });

  it('it can set custom attributes on returned tokens', () => {
    let attr = { foo: 'bar' };
    let setAttr = jest.fn(() => attr);
    let result = symbol('TEST', 'NAME', { setAttributes: setAttr }).onMatch(stubs.matchResult);
    
    expect(setAttr.mock.calls.length).toBe(1);
    expect(result.attributes).toBe(attr);
  });
});
