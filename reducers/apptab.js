import CONSTS from '../constants'

const INITIAL_STATE = {
  currentAppTabIndex: 0,//全局app tabindex
}

export default function template (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONSTS.SET_APPTAB_INFO:
      return {
        ...state,
        ...action.payload
      };
    default:
    	return state
  }
}