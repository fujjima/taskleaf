import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar } from 'Components/Organisms/Sidebar/Sidebar';
import NotFoundPage from 'Components/Pages/NotFoundPage';
import { TasksContainer } from 'Containers/TasksContainer';
import { TagsContainer } from 'Containers/TagsContainer';
import { ReportsContainer } from 'Containers/ReportsContainer';

export const PrivateRoutes = (props) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.isLoggedIn;

  if (isLoggedIn) {
    return (
      <Sidebar>
        <Switch>
          <Route exact path="/tasks" component={TasksContainer} />
          <Route exact path="/tags" component={TagsContainer} />
          <Route exact path="/reports" component={ReportsContainer} />
          <Route path="/tasks/:id" component={TasksContainer} />
          <Route component={NotFoundPage} />
        </Switch>
      </Sidebar>
    );
  } else {
    return <Redirect to="/" />;
  }
};
