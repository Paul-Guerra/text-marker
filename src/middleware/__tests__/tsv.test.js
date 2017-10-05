/* global describe, it, expect, jest */
import tsv from '../tsv';
import stubs from '../__stubs__/tsv.stubs';

describe('tsv()', () => {
  it('returns an original text if no tab is found', () => {
    expect(tsv(stubs.noTabs)).toBe(stubs.noTabs);
  });

  it('handles single row tables', () => {
    expect(tsv(stubs.singleRow.input)).toBe(stubs.singleRow.output);
  });

  it('handles empty table cells', () => {
    expect(tsv(stubs.emptyCells.input)).toBe(stubs.emptyCells.output);
  });

  it('handles multiple row tables', () => {
    expect(tsv(stubs.threeRows.input)).toBe(stubs.threeRows.output);
  });

  it('handles multiple lines of plain text before and after tables', () => {
    expect(tsv(stubs.multipleLinesAround.input)).toBe(stubs.multipleLinesAround.output);
  });

  it('handles a trailing line break', () => {
    expect(tsv(stubs.trailingLineBreak.input)).toBe(stubs.trailingLineBreak.output);
  });

  it('inserts custom placeholder text', () => {
    expect(tsv(stubs.custom.input, stubs.custom.placeholder)).toBe(stubs.custom.output);
  });

  it('ends table when the next line has no tabs', () => {
    expect(tsv(stubs.textAfter.input)).toBe(stubs.textAfter.output);
  });
});
