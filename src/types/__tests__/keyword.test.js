/* global jest, describe, it, expect */
import keyword from '../keyword';
import stubs from '../__stubs__/keyword.stubs';

global.console = { error: jest.fn() };

describe('keyword()', () => {
  it('returns an object', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result).toBe('object');
  });
  
  it('accepts a regex as an argument', () => {
    let dummyRegex = /hello/;
    let result = keyword(dummyRegex, 'NAME');
    expect(result.pattern).toBe(dummyRegex);
  });

  it('accepts an array of strings an argument', () => {
    let strings = ['foo, barr'];
    let result = keyword(strings, 'NAME');
    expect(typeof result).toBe('object');    
  });
    
  it('it returns false if it cannot create a pattern', () => {
    let result = keyword(0, 'NAME');
    expect(result).toBe(false);
  });
});

describe('keyword().pattern', () => {
  it('exists', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern).toBeTruthy();
  });

  it('is a regex', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern instanceof RegExp).toBe(true);
  });

  it('has gi flags', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern.flags).toBe('gi');
  });
  
  it('matches the keyword with a preceeding space', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern.exec('spaces before TEST')).toBeTruthy();
  });

  it('matches the keyword with a following space', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern.exec('TEST spaces after')).toBeTruthy();
  });

  it('matches the keyword surounded by spaces', () => {
    let {pattern} = keyword('TEST', 'NAME');
    expect(pattern.exec('spaces before TEST spaces after')).toBeTruthy();
  });
  
  it('can detect more than one keyword', () => {
    let strings = ['foo', 'bar'];
    let {pattern} = keyword(strings, 'NAME');    
    expect(pattern.exec('aaa foo bbb bar').index).toBe(3);
    expect(pattern.exec('aaa foo bbb bar').index).toBe(11);
  });
});


describe('keyword().onMatch', () => {
  it('exists', () => {
    let result = keyword('TEST', 'NAME');
    expect(result.onMatch).toBeTruthy();
  });

  it('is a function', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result.onMatch).toBe('function');
  });

  it('returns an object', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result.onMatch(stubs.matchResult)).toBe('object');
  });

  it('uses name provided', () => {
    let result = keyword('TEST', 'FOO').onMatch(stubs.matchResult);
    let name = result.name;
    expect(name).toBe('FOO');
  });

  it('has type \'KEYWORD\'', () => {
    let result = keyword('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.type).toBe('KEYWORD');
  });

  it('has chars string that matches 2nd regex group', () => {
    let rule = keyword('TEST', 'NAME');
    let result = rule.onMatch(stubs.matchResult);
    expect(result.chars).toBe(stubs.matchResult[2]);
  });

  it('has an index', () => {
    let result = keyword('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.index).toBe(19);
  });

  it('handle is  \'at\'', () => {
    let result = keyword('TEST', 'NAME').onMatch(stubs.matchResult);
    expect(result.handle).toBe('at');
  });
});
