import * as React from 'react';
import Parser, { parse } from '../lib/text_parser';

function bold(text) {
  return (<strong>{text}</strong>);
}

function test(text) {
  let key = 'bold';
  let keyPos = text.indexOf(key);
  let prefix;
  let target;
  let postfix;
  if (keyPos > -1) {
    prefix = text.slice(0, keyPos);
    target = text.slice(keyPos, keyPos + key.length);
    postfix = text.slice(keyPos + key.length, text.length);
  }
  return (
    <span>
      {prefix}{bold(target)}{postfix}
    </span>
  );
}

// export default data => test(data.text);
export default (data) => {
  console.profile('parse');
  parse(data.text);
  console.profileEnd('parse');
  return test(data.text);
};
