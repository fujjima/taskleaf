// ------------------------------------------------------------------------------------------------------

// memo

// entry
// 最初に読み込まれるjsファイルを指定すれば、その中で呼ばれている依存関係を解決してくれる
// エントリーに指定されたファイルが依存しているライブラリを読み込んでくれる

// loader
// JSしか理解できないwebpackに、cssやhtmlといったファイルをモジュールに変換できる機能を追加する

// plugin
// ファイルのバンドル以外のタスク（カスタムタスク）を実行する
// ファイルの圧縮などはここで行う

// output
// 読み込んだJSをまとめて出力

// -------------------------

// TODO群

// バックサイドからのjsonをreact側で受け取れるようにする
// バックサイドへのリクエストをreactから投げれるようにする
// router中継、レンダリング本拠地

// ライブラリをrequireする場所の集約

// async, awaitについての理解を深める

// ------------------------------------------------------------------------------------------------------

// TODO: 今後必要となるライブラリについては、最終的にここに読み込まれるように設定する
import { fetch } from 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import Main from './Components/Main';

class App extends React.Component {
  // fetchApi = (url, options) => {
  //   return fetch(url, options);
  // };

  // fetchRails = async () => {
  //   const url = 'http://127.0.0.1:3000/tasks';
  //   const options = {
  //     mode: 'cors',
  //     credentials: 'include',
  //     method: 'get',
  //   };

  //   // TODO:エラーハンドリングについて
  //   // awaitはpromiseが確定して結果が帰ってくるまでJSの処理を停止させる
  //   // awaitはPromiseオブジェクトに対して使用する
  //   try {
  //     const res = await this.fetchApi(url, options);
  //     const data = res.json();
  //   } catch (err) {}
  // };

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
