import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from '../Components/Pages/LoginPage/LoginPage';
import UserProvider from '../Components/Provider/UserProvider';
import PrivateRoutes from '../Lib/PrivateRoutes';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <UserProvider>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <PrivateRoutes />
          </Switch>
        </UserProvider>
      </Router>
    );
  }
}
