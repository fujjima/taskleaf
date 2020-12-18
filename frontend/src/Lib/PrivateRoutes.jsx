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
import { TasksContainer } from '../Containers/TasksContainer';

export const PrivateRoutes = (props) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.isLoggedIn;

  if (isLoggedIn) {
    return (
      <Sidebar>
        <Router>
          <Switch>
            <Route path="/tasks" component={TasksContainer} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </Sidebar>
    );
  } else {
    return <Redirect to="/" />;
  }
};
