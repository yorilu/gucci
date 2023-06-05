import CONSTS from '../constants'
import Utils from '../utils'

const INITIAL_STATE = {
  token: null,
  userInfo: null,
  tempMemberId: ''
}

export default function app (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONSTS.SET_USER_INFO:
      Utils.setStorage(CONSTS.USER_INFO, action.payload.userInfo || "");
      return {
        ...state,
        ...action.payload
      };
    case CONSTS.SET_TOKEN:
      
      return {
        ...state,
        ...action.payload
      };
    default:
    	return state
  }
}