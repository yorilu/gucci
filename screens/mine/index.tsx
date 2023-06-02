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
import { useDispatch } from 'react-redux'
import {setToken, setUserInfo} from '../../actions'

const mineBg = require('../../assets/images/mine/top-bg.png');
const mineIncomeBg = require('../../assets/images/mine/mine-income-bg.png');
const mineIncomeIcon = require('../../assets/images/mine/mine-income.png');
const mineOrderBg = require('../../assets/images/mine/mine-order-bg.png');
const mineOrderIcon = require('../../assets/images/mine/mine-order.png');
const headerIcon = require('../../assets/images/mine/header.png');

const WINDOW = Dimensions.get("window");
const { getUrlWithHost , goWebView} = Utils;

const FIRST_BANNER_SIZE = {
  width: 380,
  height: 150
}

const {assetsHost, biyingApi, LOGIN_PAGE, BYN_APP_KEY, BYN_APP_SECRET, customerId, OSS_PATH, REDBAG_URL, FANLI_URL, OTHER_FANLI_URL} = getEnv();
const getFile = (key)=>{
  return assetsHost + key;
}

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [indexData, setIndexdata] = useState({
    bannerData: [],
    myOrderData:[],
    myData: []
  })

  const userInfo = null;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("======focus======")
      init();
    });
  
    return unsubscribe;
  }, [navigation]);

  const init = async ()=>{
    let [bannerData = [], myOrderData = [], myData = []] = await Promise.all([
      queryData({modelName:'banner', position: 3}),
      queryData({modelName:'diamond', category: 55, position: 3}),
      queryData({modelName:'diamond', category: 55, position: 2}),
    ])
    setIndexdata({
      bannerData,
      myOrderData,
      myData
    })
  }

  const myGoWebView = (params)=>{
    const { uri = '', login } = params;
    if((!uri.startsWith("http") || uri.indexOf("alipay")>-1 || uri.indexOf("weixin")>-1) && login != true ){
      Linking.openURL(uri);
      return false;
    }

    goWebView({
      navigation,
      uri,
      params
    })
  }

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

  const firstBannerCarouselHeight =  (WINDOW.width - 24) / FIRST_BANNER_SIZE.width * FIRST_BANNER_SIZE.height;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* 顶部个人信息 */}
        <View style={styles.topBgWrap}>
          <Image source={mineBg} resizeMode="cover" resizeMethod="scale" style={styles.topBg}/>
          
          
          <View style={styles.headerWrap}>
            <Image source={headerIcon} resizeMode="contain" resizeMethod="scale" style={styles.avatar}/>
            <View style={styles.topLine}>
              <TouchableWithoutFeedback 
                onPress={()=>{
                  myGoWebView({
                    login: true,
                    uri: LOGIN_PAGE
                  })
                }}
              >
                <Text style={styles.topLineTitle}>{userInfo || '暂未登录'}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.topLine}>
              { userInfo && <Text style={styles.topLineTitle}>{userInfo}</Text>}
              <Text style={styles.topLineSubTitle}>优惠券<AntDesign name="right" size={12} color="#999" /></Text>
            </View>
          </View>
        </View>

        <View style={styles.bodyWrap}>

          {/* 订单收益 */}
          <View style={styles.orderWrap}>
            <TouchableWithoutFeedback 
              onPress={()=>{
                myGoWebView({
                  uri: FANLI_URL
                })
              }}
            >
              <View style={styles.orderItem}>
                <Image source={mineOrderBg} resizeMode="cover" style={styles.orderItemBg}/>
                <Text style={styles.orderItemText}>返利订单收益</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback 
              onPress={()=>{
                myGoWebView({
                  uri: OTHER_FANLI_URL
                })
              }}
            >
              <View style={styles.orderItem}>
                <Image source={mineIncomeBg} resizeMode="cover" style={styles.orderItemBg}/>
                <Text style={styles.orderItemText}>其他收益</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Banner */}
          { indexData.bannerData && !!indexData.bannerData.length && <Carousel 
            style={{...styles.bannerCarousel, height: firstBannerCarouselHeight}} 
            autoplay
            infinite
            dots={false}
            autoplayInterval = { 5000 }
          >
            {
              indexData.bannerData.map((item, index)=>{
                const uri = getFile(item.img);
                return (
                  <TouchableWithoutFeedback 
                    key={index}
                    onPress={()=>{
                      myGoWebView({
                        uri: item.url
                      })
                    }}
                  >
                    <Image
                      style={styles.bannerImage}
                      source={{uri}}
                      resizeMode="contain"
                    />
                  </TouchableWithoutFeedback>
                )
              })
            }
          </Carousel>}

          {/* 金刚位1 */}
          <View style={styles.operationContainer}>
            <Text style={styles.operationWrapTitle}>我的订单</Text>
            <View style={styles.operationWrap}>
            {
              indexData.myOrderData.map((item, index)=>{
                const uri = getFile(item.img);
                  return (
                      <TouchableWithoutFeedback 
                        key={index}
                        onPress={()=>{
                          myGoWebView({
                            uri: item.url
                          })
                        }}
                      >
                        <View style={styles.operationItem}>
                          <Image
                            style={styles.operationImage}
                            source={{uri}}
                          />
                          <Text style={styles.operationTitle}>{item.title}</Text>
                          <Text style={styles.operationSubTitle}>{item.subtitle}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                  )
                })
              }
            </View>
          </View>

          {/* 金刚位2 */}
          <View style={styles.operationContainer}>
            <View style={styles.operationWrap}>
            {
              indexData.myData.map((item, index)=>{
                const uri = getFile(item.img);
                  return (
                      <TouchableWithoutFeedback 
                        key={index}
                        onPress={()=>{
                          myGoWebView({
                            uri: item.url
                          })
                        }}
                      >
                        <View style={styles.operationItem}>
                          <Image
                            style={styles.operationImage}
                            source={{uri}}
                          />
                          <Text style={styles.operationTitle}>{item.title}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                  )
                })
              }
            </View>
          </View>
        </View>      
      </View>
    </ScrollView>
  );
}
