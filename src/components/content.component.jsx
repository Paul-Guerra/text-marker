import * as React from 'react';
import { parse } from '../lib/text_parser';
import { printTokens } from '../lib/text_parser/lexer';

function test(text) {
  return (
    <span>
      {text}
    </span>
  );
}

// export default data => test(data.text);
export default (data) => {
  console.profile('parse');
  let tokens = parse(data.text);
  console.profileEnd('parse');
  return test(data.text);
};
