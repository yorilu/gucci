import CONSTS from '../constants'

const INITIAL_STATE = {
  mainConfig : {},
  productsConfig: {},
  businessAreaCodeFromPage: '', //选择的展业code
  businessAreaSwiperFromPage: []//选中的展业banner数据
}

export default function template (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONSTS.SET_TEMPLATE_INFO:
      return {
        ...state,
        ...action.payload
      };
    default:
    	return state
  }
}