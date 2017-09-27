/* global describe, it, expect, jest */
import tsv from '../tsv';

describe('tsv()', () => {
  it('returns an original text if no tab is found', () => {
    let noTabs = 'foo\nbar';
    expect(tsv(noTabs)).toBe(noTabs);
  });
});
