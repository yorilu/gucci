/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import $fetch from '../utils/fetch';
import getEnv from '../constants/ENV'
import Utils from '../utils/'

const apiUrl = getEnv().api;

const host = {
  
}

const Models = {
  querySceneConfig: {
    api: "newmall-client/client/sceneConfig/query"
  },
  queryLocation: {
    api: "newmall-client/client/sceneConfig/queryLocation"
  },
  queryHotGoods: {
    api: "newmall-client/client/sceneConfig/queryHotGoods"
  }
}

const customerId = "1579784156951166977";

export default function(modelName){
  const config = Models[modelName];
  const url = apiUrl + config.api + "/?_t=" + Date.now();
  return {
    send:(body = {}, options = {})=>{
      return $fetch(url, {
        customerId,
        ...body
      }, options)
    }
  }
}
