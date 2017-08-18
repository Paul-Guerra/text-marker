import * as React from 'react';

function test(text) {
  return (
    <span>
      {text}
    </span>
  );
}

export default (data) => {
  return test(data.text);
};
