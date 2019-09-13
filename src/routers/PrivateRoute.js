import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import ShowRooms from '../components/ShowRooms';

export const PrivateRoute = ({
  isAuthenticated,
  isAdmin,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => (
      isAuthenticated  && isAdmin ? (
        <div>
          <Header />
          <div className='container'>
            <ShowRooms />
            <Component {...props} />
          </div>
        </div>
      ) : (
          <Redirect to="/" />
        )
    )} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.uid,
  isAdmin: !state.auth.isAnonymous
});

export default connect(mapStateToProps)(PrivateRoute);
