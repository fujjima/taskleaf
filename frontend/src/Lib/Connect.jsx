// --------------------------------------------------------------------------
// description

// ただし、urlは特に理由がなければリクエストを飛ばした際のURLをそのまま使用する形にする

// --------------------------------------------------------------------------

import { fetch } from 'whatwg-fetch';
import Routes from './Routes';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Connect {
  // URL中のクエリを除去
  removeQuery = (url) => {
    return url.replace(/\?.*$/, '');
  };

  excuteFetch = async (url, options) => {
    const result = await fetch(url, options);
    // TODO: なぜここのawaitが必要なのか
    const data = await result.json();
    return data;
  };

  login = (data) => {
    const url = 'http://localhost:3000/login';
    const options = {
      mode: 'cors',
      method: 'POST',
      withCredentials: true,
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

    // ログインの成功可否によって、タスク一覧へのリダイレクト、メッセージの表示をだし分けしたいので、レスポンスが欲しい
    this.excuteFetch(url, options)
      .then((response) => {
        // ログイン失敗ならメッセージを表示してページ更新
        if ('errors' in response) {
          return alert('error');
        }
        // ログイン成功ならタスク一覧ページにリダイレクト
        return (location.href = '/tasks');
      })
      .catch((err) => {
        return err;
      });
  };
}

export const connect = new Connect();
