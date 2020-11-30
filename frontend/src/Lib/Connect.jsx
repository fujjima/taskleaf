// --------------------------------------------------------------------------
// description

// ただし、urlは特に理由がなければリクエストを飛ばした際のURLをそのまま使用する形にする

// --------------------------------------------------------------------------

import { fetch } from 'whatwg-fetch';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Connect {
  // URL中のクエリを除去
  removeQuery = (url) => {
    return url.replace(/\?.*$/, '');
  };

  excuteFetch = async (url, options = {}) => {
    const result = await fetch(url, options);
    // TODO: awaitの必要性について整理
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

    this.excuteFetch(url, options)
      .then((response) => {
        // ログイン失敗：メッセージを表示
        if ('errors' in response) {
          return alert('error');
        }
        // ログイン成功：タスク一覧画面に遷移
        return (location.href = '/tasks');
      })
      .catch((err) => {
        return err;
      });
  };

  getTasks = () => {
    // 現在のパスを取得するようにしたい
    const url = 'http://localhost:3000/api/tasks';
    const options = {
      mode: 'cors',
      method: 'GET',
      withCredentials: true,
      headers: {
        // TODO: headerの値について
        // https://qiita.com/mpyw/items/0595f07736cfa5b1f50c
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    // TODO: returnの必要性について
    return this.excuteFetch(url, options)
      .then((response) => {
        if ('errors' in response) {
          alert('error');
        }
        return response;
      })
      .catch((err) => {
        err;
      });
  };

  // リソースの部位の更新パターンが複数あるため、PUTで送信する
  updateTask = (data) => {
    const url = 'http://localhost:3000/api/tasks';
    const options = {
      mode: 'cors',
      method: 'PUT',
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    };

    this.excuteFetch(url, options)
      .then((response) => {
        // update失敗:メッセージを表示
        if ('errors' in response) {
          return alert('error');
        }
        // update成功:メッセージがあれば表示、なければ何もしない
        // 更新後のtaskを返す
        return (location.href = '/tasks');
      })
      .catch((err) => {
        return err;
      });
  };
}

export const connect = new Connect();
