
// anything left over after getting the markup symbols is a string literal.
// unlike the BLOCK anf KEYWORD tokenizers there are no more patterns to match 
// we should have the index before the tokenizer is called
export default function literal(text, start) {
  return {
    type: 'LITERAL',
    chars: text,
    start,
  };
}
