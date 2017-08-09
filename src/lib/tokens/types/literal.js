
// anything left over after getting the markup symbols is a string literal.
// unlike the BLOCK anf KEYWORD tokenizers there are no more patterns to match 
// we should have the index before the tokenizer is called
export default function tokenizer(text, start, name) {
  return {
    name,
    type: 'LITERAL',
    chars: text,
    start
  };
}
