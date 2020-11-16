// ---------------------------------------------------

// TODO群

// バックサイドからのjsonをreact側で受け取れるようにする
// バックサイドへのリクエストをreactから投げれるようにする
// router中継、レンダリング本拠地

// ライブラリをrequireする場所の集約

// async, awaitについての理解を深める

// ---------------------------------------------------

import { fetch } from 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  fetchApi = (url, options) => {
    return fetch(url, options);
  };

  fetchRails = async () => {
    // TODO: 接続先情報の集約
    // fetch(url, init)
    // initにはHTTP通信を行う際の設定を行うことができる
    // https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch
    const url = 'http://127.0.0.1:3000/tasks';
    const options = {
      mode: 'cors',
      credentials: 'include',
      method: 'get',
    };

    // TODO:エラーハンドリングについて
    // awaitはpromiseが確定して結果が帰ってくるまでJSの処理を停止させる
    // awaitはPromiseオブジェクトに対して使用する
    try {
      const res = await this.fetchApi(url, options);
      const data = res.json();
    } catch (err) {}
  };

  render() {
    return (
      <div>
        <p>Hello React!</p>
        <button onClick={() => this.fetchRails()}>request to rails</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
