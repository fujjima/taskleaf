// --------------------------------------------------------------------------
// description

// ただし、urlは特に理由がなければリクエストを飛ばした際のURLをそのまま使用する形にする
// POST通信の際のoptionsに関する問題について

// --------------------------------------------------------------------------

import { fetch } from 'whatwg-fetch';
import { csrfToken } from '@rails/ujs';

class Connect {
  // URL中のクエリを除去したい場合
  removeQuery = (url) => {
    return url.replace(/\?.*$/, '');
  };

  login = (data) => {
    // URL取得について
    // CORS対策

    // 固有のHTTPヘッダをfront側で付与する方式
    // https://qiita.com/mpyw/items/0595f07736cfa5b1f50c
    const url = 'http://localhost:3000/login';
    const options = {
      mode: 'cors',
      method: 'POST',
      withCredentials: true,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    };

    try {
      const res = fetch(url, options);
      const resJson = res.json();
    } catch (err) { }
  };
}

export const connect = new Connect();
