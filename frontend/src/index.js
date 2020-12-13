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
