import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../src/Stores/Store';
import { PrivateRoutes } from '../Lib/PrivateRoutes';
import LoginPage from './Pages/LoginPage/LoginPage';
import { AuthProvider } from './Provider/AuthProvider';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/" component={LoginPage} />
              <PrivateRoutes />
            </Switch>
          </AuthProvider>
        </Router>
      </Provider>
    );
  }
}
