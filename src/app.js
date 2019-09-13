import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import {  Redirect } from 'react-router-dom';
import configureStore from './store/configureStore';
import { login, logout , signInAnonymously } from './actions/auth';
import { sendMessage } from './actions/rooms';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import database, { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import { setStartState, clearState } from './actions/rooms';
import {joinLastCreatedRoom , clearStateMainRoom} from './actions/mainRoom';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;

// store.dispatch(startListening());

const renderApp = () => {
  if (!hasRendered) {
    // store.dispatch(setStartState());
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch(clearState);
  store.dispatch(clearStateMainRoom);
  if (user) {
    const name = user.displayName ? 
                    user.displayName :
                     user.email ? 
                     user.email :
                     'Anonim';
    //store.dispatch(clearStateMainRoom);
    store.dispatch(login(user.uid, name , user.isAnonymous));
    if(user.isAnonymous) {
      store.dispatch(joinLastCreatedRoom(user));
    }else{
      store.dispatch(setStartState());   
      history.push('/admin');
    }

    console.log('User Authenthicated! Guest?' ,user.isAnonymous );

  } else {

    if (!history.location.pathname === '/') {
      store.dispatch(logout());
      store.dispatch(clearState);
      store.dispatch(clearStateMainRoom);
      history.refresh();
    }else{
   store.dispatch(signInAnonymously());
    }
    console.log('User Logged Off!'  );
  }
  renderApp();
});

