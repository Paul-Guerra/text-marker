const oneRow = 'Step 1	foo bar baz	lorem ipsum';
const oneColumn = 'Step 1	';
const twoColumn = 'Step 1	foo bar baz';
let twoColumnMatch = ['Step 1	foo bar baz'];
twoColumnMatch.index = 0;
twoColumnMatch.input = 'Step 1	foo bar baz';

const normal = `Step 1	foo bar baz	lorem ipsum
Step 2	foo2 bar2 baz2	lorem2 ipsum2
Step 3	foo3 bar3 baz3	lorem3 ipsum3
`;


const markUpAroundTable = `
*bold starts before the table
Step 1	foo bar baz	lorem ipsum
Step 2	foo2 bar2 baz2	lorem2 ipsum2
Step 3	foo3 bar3 baz3	lorem3 ipsum3
and ends after the table*
`;

const markUpInCell  = 'Step 1	*foo bar baz*	lorem ipsum';

const markUpSpansCells = 'Step 1	foo2 *bar2 baz2	lorem2 ipsum2*';

const overlappingMarkUpInCell = 'Step 1	*foo2 _bar2* baz2_	lorem2 ipsum2';

const overlappingMarkUpSpansCell = 'Step 1	*foo2 _bar2 baz2	lorem2* ipsum2_';


const overlappingMarkUpBetweenCells  = `Step 1	foo bar baz	lorem ipsum
Step 2	*foo2 bar2 _baz2	lorem2* ipsum2_
Step 3	foo3 bar3 baz3	lorem3 ipsum3
`;

export default {
  normal,
  oneRow,
  oneColumn,
  twoColumn,
  twoColumnMatch,
  markUpInCell,
  markUpAroundTable,
  markUpSpansCells,
  overlappingMarkUpInCell,
  overlappingMarkUpBetweenCells
};
