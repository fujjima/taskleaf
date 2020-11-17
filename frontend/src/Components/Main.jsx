import React from 'react';
import LoginPage from './Pages/LoginPage/LoginPage';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <LoginPage />
      </div>
    );
  }
}
