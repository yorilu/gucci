import { Image , ScrollView, Linking, TouchableWithoutFeedback, Dimensions, ImageBackground, Alert} from 'react-native';
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
import { getCustomTabsSupportingBrowsersAsync } from 'expo-web-browser';
import Dialog from '../../components/Dialog';
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

const mineBg = require('../../assets/images/mine/top-bg.png');
const mineIncomeBg = require('../../assets/images/mine/mine-income-bg.png');
const mineIncomeIcon = require('../../assets/images/mine/mine-income.png');
const mineOrderBg = require('../../assets/images/mine/mine-order-bg.png');
const mineOrderIcon = require('../../assets/images/mine/mine-order.png');
const headerIcon = require('../../assets/images/mine/header.png');
const kefuIcon = require('../../assets/images/mine/kefu.png');
const otherIcon = require('../../assets/images/mine/other.png');

const WINDOW = Dimensions.get("window");
const { getUrlWithHost , goWebView} = Utils;

const FIRST_BANNER_SIZE = {
  width: 380,
  height: 150
}

const {assetsHost, biyingApi, LOGIN_PAGE, BYN_APP_KEY, CUSTOMER_SERVICE, BYN_APP_SECRET, customerId, OSS_PATH, REDBAG_URL, FANLI_URL, OTHER_FANLI_URL} = getEnv();

const getFile = (key)=>{
  return assetsHost + key;
}

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [indexData, setIndexdata] = useState({
    bannerData: [],
    myOrderData:[],
    myData: []
  })

  const dispatch = useDispatch();

  const {userInfo} = useSelector(state => state.app);
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

  const quit = ()=>{
    Alert.alert(
      '退出',
      '退出后不能查看订单，确认退出吗？',
      [{
        text: '取消'
      },
      {
        text: '确定',
        onPress: ()=>{
          dispatch(setUserInfo({
            userInfo: null
          }))
          navigation.navigate("Index");
          try{
            RCTNetworking.clearCookies(() => {});
          }catch(e){
            console.log(e);
          }
        }
      },]
    )
  }

  const goAbout = ()=>{
    navigation.push("About")
  }

  const firstBannerCarouselHeight =  (WINDOW.width - 24) / FIRST_BANNER_SIZE.width * FIRST_BANNER_SIZE.height;

  return (
    <View style={styles.container}>
      {/* 顶部个人信息 */}
      <View style={styles.topBgWrap}>
        <Image source={mineBg} resizeMode="cover" resizeMethod="scale" style={styles.topBg}/>
        
        <View style={styles.topIconsWrap}>
          <TouchableWithoutFeedback 
              onPress={()=>{
                myGoWebView({
                  uri: CUSTOMER_SERVICE
                })
              }}
            >
            <Image source={kefuIcon} resizeMode="contain" resizeMethod="scale" style={{...styles.topIcon, ...styles.kefuIcon}}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback 
              onPress={()=>{
                goAbout();
              }}
            >
            <Image source={otherIcon} resizeMode="contain" resizeMethod="scale" style={styles.topIcon}/>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.headerWrap}>
          <Image source={!!userInfo && userInfo.avator || headerIcon} resizeMode="contain" resizeMethod="scale" style={styles.avatar}/>
          <View style={styles.topLine}>
            <TouchableWithoutFeedback 
              onPress={()=>{
                if(userInfo) return;
                myGoWebView({
                  isLogin: true,
                  uri: LOGIN_PAGE
                })
              }}
            >
              <Text style={styles.topLineTitle}>{!!userInfo && userInfo.mobile || '暂未登录'}</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.topLine}>
            { !!userInfo && <Text style={styles.topLineTitle}>{!!userInfo || '无优惠券'}</Text>}
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
        {/* 退出 */}
        {
          !!userInfo && <TouchableWithoutFeedback 
            onPress={()=>{
              quit();
            }}
          >
            <View style={styles.quitWrap}>
              <Text>退出</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>    
      <Dialog position={2}  navigation={navigation}></Dialog>
    </View> 
  );
}