import { Image , ScrollView, Linking, RootTagContext} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel } from '@ant-design/react-native';

import { WebView } from 'react-native-webview';

const {assetsHost, customerId} = getEnv();

export default function WebViewPage({ uri = '' , navigation =null , pageTitle}) {

  const webviewHandler = useRef(null);
  

  if(pageTitle){
    navigation.setOptions({
      title: pageTitle
    })
  }


  const onNavigationStateChange = (e)=>{
    console.log("onNavigationStateChange", e);
  }

  const onload = ()=>{

    const injectJavascriptStr =  `(function() {
        localStorage.setItem("CUSTOMER_ID","${customerId}");

        // let message = {
        //   type: "navigate",
        //   data: {
        //     page: "WebView",
        //     uri: "http://www.baidu.com",
        //     pageTitle: "标题"
        //   }
        // }

        // message = JSON.stringify(message)

        // window.ReactNativeWebView.postMessage(message);
    })()`;


    if(webviewHandler && webviewHandler.current) {
      try{
        webviewHandler.current.injectJavaScript(injectJavascriptStr)
      }catch(e){
        console.log("webview injectJavascriptStr error", e)
      }
    } 
  }

  const onMessage = (e)=>{
    const { nativeEvent } = e;

    try{
      const jsonData = JSON.parse(nativeEvent.data);

      const {type = '', data} = jsonData;

      const {page, ...rest} = data;
      /*
        data = {
          page: "Home",
          uri: "ddd",
          pageTitle: "页面标题"
        }
      */

      console.log("===rest===",rest)
      switch(type){
        case 'switchTab':  
        case 'navigate': 
          page && navigation.navigate(page, rest)
          break
        case 'goBack':
          navigation.goBack();
      }
      console.log("Webview onMessage", messageData);
    }catch(e){
      console.log("onMessage error", e);
    }

    

    const {type = '' , params = {} } = nativeEvent.data;
    console.log("====type===",type)
    debugger;
  }

  return (
    <View style={styles.container}  style={{ flex: 1, backgroundColor:'#F7F7F7' }}>
      {uri && <WebView 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist = {["*"]}
        applicationNameForUserAgent={'GucciApp/1.0.0'}
        onNavigationStateChange={onNavigationStateChange}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          const { url } = nativeEvent;

          //如果是weixin schema，打开微信
          if(url.indexOf("weixin") == 0){
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