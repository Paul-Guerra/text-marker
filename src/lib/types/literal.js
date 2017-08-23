
// anything left over after getting the markup symbols is a string literal.
// unlike the BLOCK anf KEYWORD tokenizers there are no more patterns to match 
// we should have the index before the tokenizer is called
export default function literal(text, start) {

  if (typeof text !== 'string') {
    console.error('LITERAL requires text index to be a string. Got', typeof text);
    return false;
  }

  if (typeof start !== 'number') {
    console.error('LITERAL requires start index to be a number. Got', typeof start);
    return false;
  }
  return {
    type: 'LITERAL',
    chars: text,
    index: start,
  };
}
