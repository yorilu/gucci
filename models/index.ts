/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import $fetch from '../utils/fetch';
import getEnv from '../constants/ENV'
import Utils from '../utils/'

const {api:apiUrl, customerId=''} = getEnv();

const Models = {
  // querySceneConfig: {
  //   api: "newmall-client/client/sceneConfig/query"
  // },
  // queryLocation: {
  //   api: "newmall-client/client/sceneConfig/queryLocation"
  // },
  // queryHotGoods: {
  //   api: "newmall-client/client/sceneConfig/queryHotGoods"
  // }
  banner: {
    api: '/app/banner'
  },
  category: {
    api: '/app/category'
  },
  diamond: {
    api: '/app/diamond'
  },
  waterfall: {
    api: '/app/fall'
  },
  nav: {
    api: '/app/nav'
  }
}

export default function(modelName){
  const config = Models[modelName];
  const url = apiUrl + config.api + "/?_t=" + Date.now();
  console.log("===api send===", url);
  return {
    send:(body = {}, options = {})=>{
      return $fetch(url, {
        customerId,
        ...body
      }, options)
    }
  }
}
