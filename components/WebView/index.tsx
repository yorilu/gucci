import { Image , ScrollView, Linking, RootTagContext} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel } from '@ant-design/react-native';
import * as Location from 'expo-location';
import md5 from 'js-md5';
import $fetch from '../../utils/fetch';

import { WebView } from 'react-native-webview';

const {assetsHost, customerId, BYN_MIDDLE_PAGE, biyingApi, BYN_APP_KEY, BYN_APP_SECRET} = getEnv();
let webViewHasHistory = false;
let lastClickedTime = new Date();
let bynToken = null;
export default function WebViewPage(props) {

  console.log("webview props", props);
  
  const { uri = '' , navigation =null , getHanler = ()=>{}, pageTitle, onNavigationStateChange } = props;
  const webviewHandler = useRef(null);
  const [myWebviewUri, setMyWebviewUri] = useState("");

      //如果是必应鸟链接，则要拼上token
     
  const getByToken = async (memberId)=>{

    if(bynToken){
      return bynToken;
    }

    //去必应鸟拿token
    const t = Date.now();
    const sign = md5("3.0" + BYN_APP_SECRET + t+ BYN_APP_SECRET);
    const biyingInfo = await $fetch(biyingApi,{
      out_uid: memberId
    },{
      headers: {
        "app-key": BYN_APP_KEY,
        sign,
        t,
        v: '3.0'
      }
    })

    if(biyingInfo.token){
      bynToken = biyingInfo.token;
    }

    return bynToken;
  }
  

  useEffect(()=>{
    //if(1){
    if(uri.indexOf("sda4.top")>-1){
      const middlePageUrl = BYN_MIDDLE_PAGE.replace("{customerId}", customerId);
      console.log("middlePageUrl", middlePageUrl)
      setMyWebviewUri(middlePageUrl);
    }else{
      setMyWebviewUri(uri);
    }


    navigation.addListener('beforeRemove', (e) => {
      const currentClickedTime = new Date();
      //如果是快速双击，则可以关闭当前webview
      if((currentClickedTime - lastClickedTime) < 200){
        webViewHasHistory = false;
      }

      //赋予最后一次点击事件.
      lastClickedTime = currentClickedTime;

      if(webViewHasHistory){
        webviewHandler.current.goBack();
        e.preventDefault();
        return;
      }
      webViewHasHistory = false;
    })
  },[])
  
  if(pageTitle){
    navigation.setOptions({
      title: pageTitle
    })
  }

  //插入token.
  const injectedJavaScriptBeforeContentLoaded = `(function() {
      localStorage.setItem("CUSTOMER_ID","${customerId}");
    })();
  `
  const onload = ()=>{
    const injectJavascriptStr =  `(function() {
        localStorage.setItem("CUSTOMER_ID","${customerId}");
        
        //获取title, 通知webview
        try{
          let webViewPageTitle =  document.title || '';
          const titleMsg = JSON.stringify({
            type: 'setTitle',
            data: {
              title: webViewPageTitle
            }
          });
          window.ReactNativeWebView.postMessage(titleMsg);
        }catch(e){
          console.log("webViewPageTitle error", e);
        }

        // //测试定位
        // try{
        //   // window.ReactNativeWebView.onMessage(data=>{
        //   //   console.log(data);
        //   // })
        //   const locationMsg = JSON.stringify({
        //     type: 'getLocation'
        //   });
        //   window.ReactNativeWebView.postMessage(locationMsg);
        // }catch(e){
        //   console.log("locationMsg error", e);
        // }

    })()`;


    if(webviewHandler && webviewHandler.current) {
      try{
        webviewHandler.current.injectJavaScript(injectJavascriptStr)
      }catch(e){
        console.log("webview injectJavascriptStr error", e)
      }
    } 

    getHanler && getHanler(webviewHandler.current);
  }

  const onMessage = async (e)=>{
    const { nativeEvent } = e;

    try{
      const jsonData = JSON.parse(nativeEvent.data);
      console.log("Webview onMessage", jsonData);

      const {type = '', data = {}} = jsonData;

      switch(type){
        case 'switchTab':  
        case 'navigate': 
          const {page, ...rest} = data;
          page && navigation.navigate(page, rest)
          break;
        case 'goBack':
          navigation.goBack();
          break;
        case 'setTitle':
          const {title = ''} = data;
          navigation.setOptions({
            title
          })
          break;
        case 'getLocation':
          const locationData = await getLocation();
          // const message = JSON.stringify({
          //   data: locationData
          // });
          // webviewHandler.postMessage(message);
          break;
        case 'message':
          //这里肯定是必应鸟链接
          if(data.member_id){
            const token = await getByToken(data.member_id);
            console.log("必应鸟Token = ", token);
            if(!token){
              return;
            }
            let bynUri = uri;
            if(bynUri.indexOf("?")==-1){
              bynUri += "?";
            }else{
              bynUri += "&";
            }
            bynUri += `token=${token}`
            
            setMyWebviewUri(bynUri);
          }
          break;
      }
      
    }catch(e){
      console.log("onMessage error", e);
    }
  }

  const getLocation = async ()=>{
    let success = true, data = null;

    try{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        success = false,
        data = "Permission to access location was denied";
      }else{
        data = await Location.getCurrentPositionAsync({});
        debugger;
      }
    }catch(e){
      console.log("getLocation error", e);
    }

    console.log("===getLocation====",{
      success,
      data
    })

    return {
      success,
      data
    }
  }

  return (
    <View style={styles.container}  style={{ flex: 1, backgroundColor:'#F7F7F7' }}>
      {myWebviewUri && <WebView 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist = {["*"]}
        applicationNameForUserAgent={'GucciApp/1.0.0'}
        onNavigationStateChange={(navState)=>{
          webViewHasHistory = navState.canGoBack;
          onNavigationStateChange && onNavigationStateChange();
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          const { url } = nativeEvent;
          webViewHasHistory = nativeEvent.canGoBack;

          //如果是schema，打开浏览器
          if(url.indexOf("weixin") == 0 || url.indexOf("alipay") >-1){
            Linking.openURL(url);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          webViewHasHistory = nativeEvent.canGoBack;
          console.log("webview onError", nativeEvent)
        }}
        onLoadEnd={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          webViewHasHistory = nativeEvent.canGoBack;
        }}
        onLoadProgress={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          webViewHasHistory = nativeEvent.canGoBack;
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          webViewHasHistory = nativeEvent.canGoBack;
        }}
        onContentProcessDidTerminate= {(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          webViewHasHistory = nativeEvent.canGoBack;
        }}
        ref={ webviewHandler }
        source={{ 
          uri: myWebviewUri
        }} 
        onLoad={onload}
        style={{backgroundColor:"#F7F7F7"}}
        onMessage={onMessage}
        />
      }
    </View>
  );
}
