import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import AdminRoomPage from '../components/AdminRoomPage';
import RoomPage from '../components/RoomPage';
import MainRoom from '../components/MainRoomPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={MainRoom} exact={true} />
        <PublicRoute path="/login" component={LoginPage} />
        <PrivateRoute path="/admin" component={AdminRoomPage} />
        <PrivateRoute path="/room/:id" component={RoomPage} />        
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
