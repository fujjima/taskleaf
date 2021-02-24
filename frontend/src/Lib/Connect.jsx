import { fetch } from 'whatwg-fetch';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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
}

export const connect = new Connect();
