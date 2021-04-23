import React, { Component, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter, Route, Switch, BrowserRouter, Router } from 'react-router-dom';
import './scss/style.scss';
import PrivateRoute from './shared/auth/private-route';
import { getSession } from './views/pages/login/authenticate.reducer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Email App
// const TheEmailApp = React.lazy(() => import('./views/apps/email/TheEmailApp'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

export const App = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSession());
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />

      <React.Suspense fallback={loading}>
        <Switch>
          <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
          <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
          <PrivateRoute path="/" component={TheLayout} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
