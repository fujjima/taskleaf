import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../Components/Organisms/Sidebar/Sidebar';
import NotFoundPage from '../Components/Pages/NotFoundPage';
import TasksPage from '../Components/Pages/TasksPage/TasksPage';
import { TaskShowContainer } from '../Containers/TaskShowContainer';

export const PrivateRoutes = (props) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.isLoggedIn;

  if (isLoggedIn) {
    return (
      <Sidebar>
        <Router>
          <Switch>
            <Route exact path="/tasks" component={TasksPage} />
            {/* 少なくとも、:id部分については数字でないと弾く、とかにしたい */}
            {/* /tasks/:idで指定されたidが存在しないものだった場合白紙になってしまうので、該当ケース用のレンダリングは必要 */}
            {/* ページリロードに備えて、container内でpropsとしてtask情報を渡されていればそれを使用、なければ再度取得しにいく、というのはどうだろうか */}
            <Route path="/tasks/:id" component={TaskShowContainer} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </Sidebar>
    );
  } else {
    return <Redirect to="/" />;
  }
};
