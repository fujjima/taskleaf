import React from 'react';
import LoginPage from './Pages/LoginPage/LoginPage';
import Routes from '../Lib/Routes';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // 認証前は全てログインページへ飛ばす
      // 認証後であれば、各コンポーネントへアクセス可能
      // <div>
      //   <LoginPage />
      // </div>
      <Routes />
    );
  }
}
