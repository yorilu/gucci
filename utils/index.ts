import getEnv from '../constants/ENV'
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const { host, customerId } = getEnv();
const Utils = {
  getGuid(){
      function S4() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+""+S4()+""+S4()+""+S4()+""+S4()+S4()+S4());
  },
  getUrlWithHost(pathname){
    return host + pathname;
  },
  goWebView({
    navigation, 
    uri = '', 
    params = {}
  } = {}){
    if(!uri) return;

    // if(uri.indexOf("?") != -1){
    //   uri += `&customerId=${customerId}`
    // }else{
    //   uri += `?customerId=${customerId}`
    // }
    console.log("goWebView uri", uri, params,)
    navigation.push("WebView", {uri, ...params})
  },
  getStorage: async (key)=>{
    try {
      let value = await AsyncStorage.getItem(key) || null;
      value = JSON.parse(value);
      if (value) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
    }
  
    return null;
  },
  setStorage: async (key= '', value= '') => {
    try {
      value = JSON.stringify(value);
      await AsyncStorage.setItem(
        key,
        value,
      );
    } catch (error) {
      // Error saving data
    }
  }
}

export default Utils;
