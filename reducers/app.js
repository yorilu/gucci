import CONSTS from '../constants'



const INITIAL_STATE = {
  token: null,
  userInfo: null,
  tempMemberId: ''
}

export default function app (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONSTS.SET_TOKEN:
    case CONSTS.SET_USER_INFO:
      return {
        ...state,
        ...action.payload
      };
    default:
    	return state
  }
}