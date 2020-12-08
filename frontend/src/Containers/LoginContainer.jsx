import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoginPage from '../Components/Pages/LoginPage/LoginPage';
import { signin, signout } from '../Slices/UserSlice';

export const LoginContainer = (props) => {
  const user = useSelector((user) => user);
  const dispatch = useDispatch();

  const login = (data) => {
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
        } else if (data.logged_in) {
          dispatch(signin());
          props.history.push('/tasks');
        } else {
          return alert('not authorized');
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const logout = () => { };

  return <LoginPage login={login} logout={logout} {...user} />;
};

LoginContainer.propTypes = {
  history: PropTypes.object.isRequired,
};
