import 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  applyMiddleware,
  createStore,
} from 'redux';
import {
  Provider,
} from 'react-redux';
import reduxLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import DatasetsContainer from '../containers/datasets_container';
import BoardContainer from '../containers/board_container';
import SignInContainer from '../containers/sign_in_container';
import rootReducer from '../reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, reduxLogger),
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      sessionStorage.getItem('apiKey') !== null
        ? <Component {...props} />
        : (
          <Redirect
            to={{
              pathname: '/sign_in',
            }}
          />
        )
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

const AppRoot = () => (
  <BrowserRouter>
    <div>
      <PrivateRoute path="/datasets" component={DatasetsContainer} />
      <PrivateRoute path="/boards" component={BoardContainer} />
      <Route path="/sign_in" component={SignInContainer} />
    </div>
  </BrowserRouter>
);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <AppRoot />
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  );
});
