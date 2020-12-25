import React, { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signin, signout } from '../../Slices/UserSlice';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  // const user = useSelector((user) => user);
  const dispatch = useDispatch();
  const history = useHistory();
  const { children } = props;

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
          dispatch(signin({ ...data }));
          history.push('/tasks');
        } else {
          return alert('not authorized');
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const logout = () => {
    const url = 'http://localhost:3000/logout';
    const options = {
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
      headers: {
        // TODO: headerの値について
        // https://qiita.com/mpyw/items/0595f07736cfa5b1f50c
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
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
          return alert('error');
        }
        dispatch(signout());
        history.push('/');
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
