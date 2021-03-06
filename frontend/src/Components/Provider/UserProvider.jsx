import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { Redirect } from 'react-router-dom';
import { UserContext } from 'Context';
import { withRouter } from 'react-router-dom';

class UserProvider extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoggedIn: false,
    };
    this.login = this.login.bind(this);
  }

  login(data) {
    const url = 'http://localhost:3000/login';
    const options = {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {
        // TODO: headerの値について
        // https://qiita.com/mpyw/items/0595f07736cfa5b1f50c
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        if ('errors' in data) {
          // TODO: ログイン失敗：メッセージを表示
          return alert('error');
        } else if (data.loggedIn) {
          this.setState({ isLoggedIn: data.loggedIn }, () => {
            this.props.history.push('/tasks');
          });
        } else {
          return alert('not authorized');
        }
      })
      .catch((err) => {
        return err;
      });
  }

  render() {
    const { children } = this.props;
    return (
      <UserContext.Provider value={{ ...this.state, login: this.login }}>
        {children}
      </UserContext.Provider>
    );
  }
}

export default withRouter(UserProvider);
