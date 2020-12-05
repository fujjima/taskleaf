import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Sidebar from '../Components/Organisms/Sidebar/Sidebar';
import NotFoundPage from '../Components/Pages/NotFoundPage';
import TasksPage from '../Components/Pages/TasksPage/TasksPage';
import { UserContext } from '../Context';

export default class PrivateRoutes extends React.Component {
  static contextType = UserContext;

  render() {
    const { isLoggedIn } = this.context;
    if (isLoggedIn) {
      return (
        <Sidebar>
          <Router>
            <Switch>
              <Route path="/tasks" component={TasksPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </Sidebar>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
