import { Image , ScrollView, Linking, TouchableWithoutFeedback, Dimensions, ImageBackground} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel} from '@ant-design/react-native';
import Utils from '../../utils/index';
import { useFocusEffect } from '@react-navigation/native';
import $fetch from '../../utils/fetch';
import md5 from 'js-md5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import {setToken, setUserInfo} from '../../actions';

const { getUrlWithHost , goWebView} = Utils;


const {YHXY_URL, YSZC_URL} = getEnv();

export default function Index({ navigation }: RootTabScreenProps<'TabOne'>) {
  

  const myGoWebView = (params)=>{
    const { uri = '', isLogin } = params;
    if((!uri.startsWith("http") || uri.indexOf("alipay")>-1 || uri.indexOf("weixin")>-1) && isLogin != true ){
      Linking.openURL(uri);
      return false;
    }

    goWebView({
      navigation,
      uri,
      params
    })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableWithoutFeedback 
            onPress={()=>{
              myGoWebView({
                uri: YSZC_URL
              })
            }}
          >
          <View style={styles.block}>
            <Text>隐私政策</Text>
            <AntDesign name="right" size={16} color="black" />
          </View>
        </TouchableWithoutFeedback> 
        <TouchableWithoutFeedback 
            onPress={()=>{
              myGoWebView({
                uri: YHXY_URL
              })
            }}
          >
          <View style={styles.block}>
            <Text>用户协议</Text>
            <AntDesign name="right" size={16} color="black" />
          </View>
        </TouchableWithoutFeedback> 
      </View> 
    </ScrollView>
  );
}
