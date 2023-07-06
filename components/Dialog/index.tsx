import { Image , ScrollView, Linking, RootTagContext, TouchableWithoutFeedback} from 'react-native';
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
import {setToken, setUserInfo} from '../../actions';
import { useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import Utils from '../../utils/index';

const { getUrlWithHost , goWebView} = Utils;


export default function Index(props) {

  const {position = 1, navigation} = props;
  const {DIALOG_PIC_PATH} = getEnv();
  const {userInfo, mobile} = useSelector(state => state.app);
  const [dialogInfo, setDialogInfo] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const dialogImgUrl = (DIALOG_PIC_PATH + dialogInfo.img) || '';

  useEffect(()=>{
    const init = async ()=>{
      let userId = userInfo?.id || await AsyncStorage.getItem("TEMP_USER_ID");
      if(!userId){
        userId = Math.floor(Math.random()*1000000);
        AsyncStorage.setItem("TEMP_USER_ID", userId);
      }
      const advertInfo = await getModels('advert').send({
        user_id: userId,
        position
      },{
        method: "GET"
      })

      if(advertInfo?.code ==0){
        setDialogInfo(advertInfo.result);
        setShowDialog(true);
      }
    }

    init();
  }, [])

  const onDialogClose = ()=>{
    setShowDialog(false);
  }

  if(!showDialog){
    return (<></>)
  }

  return (
    <View style={styles.modal}>
      <TouchableWithoutFeedback onPress={onDialogClose}>
        <FontAwesome style={styles.close} name="close" size={24} color="black" />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>{
        setShowDialog(false);
        goWebView({
          uri: dialogInfo.url,
          navigation
        })
      }}>
        <Image
          resizeMode={'cover'}
          style={styles.img}
          source={{uri:dialogImgUrl}}
        />
      </TouchableWithoutFeedback>

    </View>
  );
}
