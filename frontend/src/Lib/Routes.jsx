import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from '../Components/Organisms/Sidebar/Sidebar';
import LoginPage from '../Components/Pages/LoginPage/LoginPage';
import NotFoundPage from '../Components/Pages/NotFoundPage';
import TasksPage from '../Components/Pages/TasksPage/TasksPage';

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Sidebar>
            {/* ラップされたコンポーネントに対してsidebarを表示する */}
          </Sidebar>
          <Route exact path="/" component={LoginPage} />
          <Route path="/tasks" component={TasksPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}
