export default {
  noTabs: 'foo\nbar',
  singleRow: {
    input: 'c1r1\tc2r1',
    output: '[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]]c2r1[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]'
  },
  textAfter: {
    input: 'c1r1\tc2r1\nhi',
    output: '[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]]c2r1[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]\nhi'
  },
  emptyCells: {
    input: 'c1r1\t\tc3r1',
    output: '[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]][[/TABLE_CELL]][[TABLE_CELL]]c3r1[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]'
  },
  multipleLinesAround: {
    input: 'foo\nbar\nc1r1\tc2r1\nbaz\nbiz',
    output: 'foo\nbar\n[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]]c2r1[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]\nbaz\nbiz'
  },
  threeRows: {
    input: 'c1r1\tc2r1\nc1r2\tc2r2\nc1r3\tc2r3',
    output: '[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]]c2r1[[/TABLE_CELL]][[/TABLE_ROW]][[TABLE_ROW]][[TABLE_CELL]]c1r2[[/TABLE_CELL]][[TABLE_CELL]]c2r2[[/TABLE_CELL]][[/TABLE_ROW]][[TABLE_ROW]][[TABLE_CELL]]c1r3[[/TABLE_CELL]][[TABLE_CELL]]c2r3[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]'
  },
  trailingLineBreak: {
    input: 'c1r1\tc2r1\n',
    output: '[[TABLE]][[TABLE_ROW]][[TABLE_CELL]]c1r1[[/TABLE_CELL]][[TABLE_CELL]]c2r1[[/TABLE_CELL]][[/TABLE_ROW]][[/TABLE]]\n'
  },
  custom: {
    input: 'c1r1\tc2r1',
    placeholder: { tableStart: '(T)', tableEnd: '(/T)', rowStart: '(R)', rowEnd: '(/R)', cellStart: '(C)', cellEnd: '(/C)', },
    output: '(T)(R)(C)c1r1(/C)(C)c2r1(/C)(/R)(/T)'
  },
};
