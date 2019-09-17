import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import roomsReducer from '../reducers/rooms';
import mainRoomReducer from '../reducers/mainRoom';
import blockedWordsReducer from '../reducers/blockedWords';
import videosReducer from '../reducers/videos';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      rooms: roomsReducer,
      lastRoom: mainRoomReducer,
      blockedWords: blockedWordsReducer,
      videos: videosReducer,
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
