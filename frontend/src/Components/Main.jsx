import React from 'react';
import Routes from '../Lib/Routes';
import SideBar from '../Components/Organisms/Sidebar/Sidebar';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // TODO:認証前は全てログインページへ飛ばす
      // 認証後であれば、各コンポーネントへアクセス可能
      // 認証状態であれば、ログイン後の全ページにサイドバーを表示

      //<Sidebar node={<Routes />}>みたいな感じで、Routes内で最終的にレンダリングされたコンテンツをsidebarにnodeとして渡せないか
      // サイドバー自体をテンプレート化し、routesで最終的にレンダリングされるnodeに対してテンプレートを適用する、という方法がいいかもしれない
      // https://dev.classmethod.jp/articles/react-material-ui/
      <>
        <SideBar node={<Routes />} />
      </>
    );
  }
}
