import { Image , ScrollView, Linking} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel } from '@ant-design/react-native';

import WebView from '../../components/WebView/index';

const {assetsHost, customerId} = getEnv();

export default function WebViewPage({ navigation, route = {}, uri}) {
  uri = route.params.uri || uri;

  // const [webViewCanGoBack , setWebViewCanGoBack] = useState(false);
  // const [webViewHandler, setWebViewHandler] = useState(null);

  // const onNavigationStateChange = (e)=>{
  //   const {canGoBack} = e;
  //   setWebViewCanGoBack(canGoBack);
  //   console.log("onNavigationStateChange", e, canGoBack);
  // }

  // const getHanler = (handler)=>{
  //   setWebViewHandler(handler);
  // }

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //     if(webViewCanGoBack){
  //       webViewHandler && webViewHandler.goBack();
  //       e.preventDefault();
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <View style={styles.container} style={{ flex: 1, backgroundColor:'#F7F7F7' }}>
      <WebView uri={uri}  navigation={navigation} {...route.params}></WebView>
    </View>
  );
}
