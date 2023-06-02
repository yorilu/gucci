import CONSTS from '../constants'

function setUserInfo(payload){
  return {
    type: CONSTS.SET_USER_INFO,
    payload
  }
}

function setToken(payload){
  return {
    type: CONSTS.SET_TOKEN,
    payload
  }
}

export{
  setToken,
  setUserInfo
}