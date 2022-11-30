import { Image , ScrollView, Linking} from 'react-native';
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

export default function WebViewPage({ navigation, route }) {

  const webviewHandler = useRef(null);

  const [uri, setUri] = useState("");

  useEffect(()=>{
    const { params } = route;
    const { uri } = params;
    setUri(uri)
  }, [])

  const onload = ()=>{

    const injectJavascriptStr =  `(function() {
      localStorage.setItem("CUSTOMER_ID","${customerId}")
    })()`;

    if(webviewHandler && webviewHandler.current) {
      try{
        webviewHandler.current.injectJavaScript(injectJavascriptStr)
      }catch(e){
        console.log("webview error", e)
      }
    } 
  }

  console.log("webview uri", uri);

  return (
    <View style={styles.container}  style={{ flex: 1, backgroundColor:'#F7F7F7' }}>
      {uri && <WebView 
        originWhitelist = {["*"]}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          const { url } = nativeEvent;

          //如果是weixin schema，打开微信
          if(url.indexOf("weixin") == 0){
            Linking.openURL(url);
          }
        }}
        onLoad={(syntheticEvent) => {
        }}
        onError={(syntheticEvent) => {
        }}
        ref={ webviewHandler }
        source={{ uri }} 
        onLoad={onload}
        style={{backgroundColor:"#F7F7F7"}} 
        />
      }
    </View>
  );
}
