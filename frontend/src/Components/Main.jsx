import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'Stores/Store';
import { ThemeProvider } from '@material-ui/core/styles';
import { PrivateRoutes } from 'Lib/PrivateRoutes';
import LoginPage from 'Components/Pages/LoginPage/LoginPage';
import { SignupPage } from 'Components/Pages/SignupPage/SignupPage';
import { AuthProvider } from 'Components/Provider/AuthProvider';
import { AuthenticateTheme } from 'Themes/AuthenticateTheme';

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
              <Route>
                <ThemeProvider theme={AuthenticateTheme}>
                  <Route exact path="/" component={LoginPage} />
                  <Route exact path="/signup" component={SignupPage} />
                  <PrivateRoutes />
                </ThemeProvider>
              </Route>
            </Switch>
          </AuthProvider>
        </Router>
      </Provider>
    );
  }
}
