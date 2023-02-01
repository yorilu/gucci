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

import { WebView } from 'react-native-webview';

const {assetsHost, customerId} = getEnv();
let webViewCanGoBack = false;
let lastClickedTime = new Date();
export default function WebViewPage({ uri = '' , navigation =null , getHanler = ()=>{}, pageTitle, onNavigationStateChange = ()=>{}}) {

  const webviewHandler = useRef(null);

  useEffect(()=>{
    navigation.addListener('beforeRemove', (e) => {
      const currentClickedTime = new Date();

      //如果是快速双击，则关闭
      // if((currentClickedTime - lastClickedTime) < 200){
      //   lastClickedTime = currentClickedTime;
      //   webViewCanGoBack = false;
      //   return;
      // }
      if(webViewCanGoBack){
        webviewHandler.current.goBack();
        e.preventDefault();
        return;
      }
      webViewCanGoBack = false;
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
      {uri && <WebView 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist = {["*"]}
        applicationNameForUserAgent={'GucciApp/1.0.0'}
        onNavigationStateChange={(navState)=>{
          webViewCanGoBack = navState.canGoBack;
          console.log("nativeEvent.canGoBack", webViewCanGoBack);
          onNavigationStateChange && onNavigationStateChange();
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
        onLoadStart={(syntheticEvent) => {

          
          const { nativeEvent } = syntheticEvent;
          const { url } = nativeEvent;
        

          //如果是schema，打开浏览器
          if(url.indexOf("weixin") == 0 || url.indexOf("alipay") >-1){
            Linking.openURL(url);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("webview onError", nativeEvent)
        }}
        ref={ webviewHandler }
        source={{ uri }} 
        onLoad={onload}
        style={{backgroundColor:"#F7F7F7"}}
        onMessage={onMessage}
        />
      }
    </View>
  );
}
