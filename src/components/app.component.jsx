import * as React from 'react';
import Content from './content.component';

export default () => {
  let times = 'once';
  return (
    <div>
      <h2>My mother made me an app {times}. . . {times.toUpperCase()}!</h2>
      <Content text="i am bold and you are not" />
    </div>
  );
};
