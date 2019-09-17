import * as actionTypes from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
      case actionTypes.INSERT_VIDEO_SUCCESS:
            return {
                ...state,
                [action.name]:{
                    ...state[action.name],
                    hasChanged: false  
                }
            }
        case actionTypes.UPDATE_VIDEO:
            return {
                ...state,
                [action.name]:{
                    ...state[action.name],
                    id: action.value,
                    hasChanged: true,
                }
            }
        case actionTypes.GET_VIDEOS_SUCCESS:
            return {
                ...state,
                ...action.videos
            }
        default:
        return state;
    }
};
  