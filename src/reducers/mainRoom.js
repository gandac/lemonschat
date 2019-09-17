import moment from 'moment';

const defaultState = [];

export default (state=defaultState, action) => {
  switch(action.type) {
    case 'LAST_ROOM':
      return {...state, ...action.lastRoom };
    case 'SAVE_USER_INFO':
      return {
        ...state, 
        user : {
          ...action.person
        }
      }
    case 'UPDATE_USER_MESSAGE_COUNT':
      return {
        ...state,
          user: {
            ...state.user,
            totalWords: action.count
          }
      }
    case 'TRIGGER_VIDEO':
      return {
        ...state,
        triggerVideo: [
          {
            id : action.code,
            wasClosed : false,
          }
        ]
      }
      case 'END_VIDEO':
        return {
          ...state,
          triggerVideo: [
            {
              ...state.triggerVideo[0],
              endVideo: true,
            }

          ]
        }
      case 'REMOVE_VIDEO':
        return {
          ...state,
          triggerVideo : [],
        }
    case 'CLEAR_STATE_MAIN_ROOM':
          return [];
    default:
      return state;
  }
  
};