import * as React from 'react';
import Content from './content.component';


export default ({ text }) => {
  let times = 'once';
  return (
    <div>
      <h2>My mother made me an app {times}. . . {times.toUpperCase()}!</h2>
      <pre><Content text={text} /></pre>
    </div>
  );
};
