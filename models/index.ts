/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import $fetch from '../utils/fetch';
import getEnv from '../constants/ENV'
import Utils from '../utils/'

const {api: apiUrl, customerId='', host: hostUrl, billbearApi} = getEnv();

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
  },
  getUserInfo: {
    api: 'api/authCenter/user/info',
    isHostUrl: true
  },
  getCurrentMemberMobile:{
    api: 'usercenter/admin/member/getCurrentMemberMobile',
    isBillbearApi: true
  },
  advert: {
    api: '/app/advert'
  }
}

export default function(modelName){
  const config = Models[modelName];
  let url = (config.isHostUrl? hostUrl : apiUrl) + config.api + "?_t=" + Date.now();

  if(config.isHostUrl){
    url = hostUrl;
  }else if(config.isBillbearApi){
    url = billbearApi  
  }else{
    url = apiUrl;
  }

  url += config.api + "?_t=" + Date.now();
  
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
