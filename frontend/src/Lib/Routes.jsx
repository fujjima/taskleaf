import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFoundPage from '../Components/Pages/NotFoundPage';
import LoginPage from '../Components/Pages/LoginPage/LoginPage';
import TasksPage from '../Components/Pages/TasksPage/TasksPage';

export default class Routes extends React.Component {
  // const [count, setCount] = useState(0);

  // 例：ログインに成功したらタスク一覧に進む
  //    タスク削除に成功したらタスク一覧に戻る、など
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/tasks" component={TasksPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}
