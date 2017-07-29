import * as React from 'react';

function bold(text) {
  return (<strong>{text}</strong>);
}

function parser(text) {
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

export default (data) => {
  let output = parser(data.text);
  return (
    <span>
      {output}
    </span>
  );
};
