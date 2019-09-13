import * as actionTypes from '../actions/types';

const removeProperty = (obj, property) => {
    return  Object.keys(obj).reduce((acc, key) => {
      if (key !== property) {
        return {...acc, [key]: obj[key]}
      }
      return acc;
    }, {})
  }

export default (state = {}, action) => {
    switch (action.type) {
      case actionTypes.INSERT_BLOCKED_WORDS_SUCCESS:
            return {
                ...state,
                ...action.blockWord
            };
        case actionTypes.GET_BLOCKED_WORDS_SUCCESS:
            return {
                ...state,
                ...action.blockWords
            };
        case actionTypes.REMOVE_BLOCKED_WORDS_SUCCESS:
            // return removeProperty(state,action.word)
            return state.filter(el=> el!==action.word)
        default:
            return state;
    }
};
  