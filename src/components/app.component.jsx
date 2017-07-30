import * as React from 'react';
import Content from './content.component';

export default () => {
  let times = 'once';
  let text = `i am *_bold_* and **y
  
  ou** are not`;
  return (
    <div>
      <h2>My mother made me an app {times}. . . {times.toUpperCase()}!</h2>
      <Content text={text} />
    </div>
  );
};
