// -------------------------

// TODO群

// router中継、レンダリング本拠地
// ライブラリをrequireする場所の集約
// async, awaitについての理解

// ------------------------------------------------------------------------------------------------------

import React from 'react';
import { render } from 'react-dom';
import Main from './Components/Main';

class App extends React.Component {
  render() {
    return (
      <>
        <header></header>
        <Main />
        <footer></footer>
      </>
    );
  }
}

render(<App />, document.getElementById('app'));
