import React from 'react';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: null,
    };
  }

  render() {
    return <div>ログインしました</div>;
  }
}
