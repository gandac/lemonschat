import moment from 'moment';

const defaultState = [];

export default (state=defaultState, action) => {
  switch(action.type) {
    case 'LAST_ROOM':
      return {...state, ...action.lastRoom };
    default:
      return state;
  }
};