import React from 'react';
import Routes from '../Lib/Routes';
import SideBar from '../Components/Organisms/Sidebar/Sidebar';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // TODO: 認証前は全てログインページへ飛ばす
      // TODO: ログインページにはサイドバーは表示しない

      //<Sidebar node={<Routes />}>みたいな感じで、Routes内で最終的にレンダリングされたコンテンツをsidebarにnodeとして渡せないか
      // https://dev.classmethod.jp/articles/react-material-ui/
      <>
        <SideBar node={<Routes />} />
      </>
    );
  }
}
