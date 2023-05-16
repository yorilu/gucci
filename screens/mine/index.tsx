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

const mineBg = require('../../assets/images/mine/top-bg.png');
const mineIncomeBg = require('../../assets/images/mine/mine-income-bg.png');
const mineIncomeIcon = require('../../assets/images/mine/mine-income.png');
const mineOrderBg = require('../../assets/images/mine/mine-order-bg.png');
const mineOrder = require('../../assets/images/mine/mine-order.png');


const WINDOW = Dimensions.get("window");
const { getUrlWithHost , goWebView} = Utils;

const FIRST_BANNER_SIZE = {
  width: 750,
  height: 476
}

const {assetsHost, biyingApi, BYN_APP_KEY, BYN_APP_SECRET, customerId, BYN_MIDDLE_PAGE, OSS_PATH, REDBAG_URL} = getEnv();
const getFile = (key)=>{
  return assetsHost + key;
}
let token;
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [bannerData, setBannerData] = useState([]);

  async function queryData({modelName = '', ...rest} = {}){
    try{
      const {code, result = []} = await getModels(modelName).send({
        ...rest
      },{
        method: "GET"
      })

      if(code == 0){
        return result;
      }

      return [];
    }catch(e){
      console.log(e)
    }
  }

  const firstBannerCarouselHeight =  WINDOW.width / FIRST_BANNER_SIZE.width * FIRST_BANNER_SIZE.height;

  return (
    <ScrollView>
      <View style={styles.container}>
      <Image source={mineBg} resizeMode="contain" resizeMethod="scale" style={styles.topBg}/>
      <View style={styles.bodyWrap}>
          <View style={{...styles.topLine, ...styles.topLineTitle}}>
            <Text style={styles.topLineLeftText}>比克</Text>
            <Text style={styles.topLineRightText}>100</Text>
          </View>
          <View style={styles.topLine}>
            <Text style={styles.topLineLeftText}>15900001111</Text>
            <Text style={styles.topLineRightText}>优惠券</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
