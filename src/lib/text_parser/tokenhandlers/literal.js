
// anything left over after getting the markup symbols is a string literal.
// unlike the BLOCK anf KEYWORD tokenizers there are no more patterns to match 
// we should have the index before the tokenizer is called
// export default function factory(token, name) {
//   return {
//     tokenizer: function tokenizer(text, index) {
//       return {
//         name,
//         type: 'LITERAL',
//         content: text,
//         index
//       };
//     }
//   };
// }

export default function tokenizer(text, index, name) {
  return {
    name,
    type: 'LITERAL',
    token: text,
    index
  };
}
