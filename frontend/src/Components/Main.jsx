import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LoginContainer } from '../Containers/LoginContainer';
import { Provider } from 'react-redux';
import store from '../../src/Stores/Store';
import { PrivateRoutes } from '../Lib/PrivateRoutes';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={LoginContainer} />
            <PrivateRoutes />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
