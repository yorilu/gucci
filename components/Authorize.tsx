import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Linking, ScrollView, BackHandler, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import React, { useState, useEffect } from 'react';
import { Text, View, Image } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import RNExitApp from 'react-native-exit-app';

//用户协议
const USER_URL  = "https://interests-m.shanghaibinyu.top/mall/pages/agreement/index?id=1628719677810249730&customerId=1553282691992756226";
//隐私政策
const PRIVATE_URL  = "https://interests-m.shanghaibinyu.top/mall/pages/agreement/index?id=1628719898564857858&customerId=1553282691992756226";

export default function AuthorizeComponent(props) {


  const [show, setShow] = useState(true);

  useEffect(()=>{
    async function init(){
      try{
       
      }catch(e){
        console.log(e)
      }
    }
    init(); 
  }, [])

  const goUser = ()=>{
    Linking.openURL(USER_URL);
  }

  const goPrivate = ()=>{
    Linking.openURL(PRIVATE_URL);
  }

  const agree = async ()=>{
    props.onAgree && props.onAgree();
  }

  const disagree = ()=>{
    if ( Platform.OS === 'android' ) {
      BackHandler.exitApp();
    } else {
      RNExitApp.exitApp();
    }
  }


  return (
    <View style={styles.container}>
      {show && <View style={styles.wrap}>
          <Text style={styles.title}>隐私保护提示</Text>
          <ScrollView>
            <Text>
              亲爱的用户，感谢您使用宝藏卡APP!{"\n"}
              我们非常重视您的个人信息和隐私保护。{"\n"}
              依据最新监管要求，我们更新了
              <TouchableWithoutFeedback onPress={goPrivate}><Text style={styles.link}>《槟宇用户隐私政策》</Text></TouchableWithoutFeedback>，
              特向您说明如下：{"\n"}
              1.为向您提供包括账户注册、商城购物、交易支付在内的基本功能，我们会收集、使用必要的信息;{"\n"}
              2.基于您的明示授权，我们可能会获取您的位置（为您提供附近的商品、店铺等)、设备号信息(以保障您账号与交易安全） 等信息，您有权拒绝或取消；{"\n"}
              3.我们会采取业界先进的安全措施保护您的信息安全；{"\n"}
            </Text>
          </ScrollView>
          <View>
            <Text style={styles.textWrap}>
              请您阅读并同意我们的
              <TouchableWithoutFeedback onPress={goUser}><Text style={styles.link}>《槟宇用户协议》</Text></TouchableWithoutFeedback>
              与
              <TouchableWithoutFeedback onPress={goPrivate}><Text style={styles.link}>《槟宇隐私政策》</Text></TouchableWithoutFeedback>，了解您的用户权益及相关使用数据的处理方法。
            </Text>
          </View>
          <View style={styles.btnWrap}>
            <TouchableWithoutFeedback onPress={disagree}><View style={{...styles.leftBtn, ...styles.btn}}><Text>不同意</Text></View></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={agree}><View style={{...styles.rightBtn, ...styles.btn}}><Text>同意</Text></View></TouchableWithoutFeedback>
          </View>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#7F7F7F"
  },
  wrap:{
    width: 320,
    height: 400,
    borderRadius: 6,
    padding: 15,
    paddingBottom: 0
  },
  btnWrap:{
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textWrap: {
    paddingTop: 10
  },
  btn:{
    width: 80,
    height: 30,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 10
  },
  rightBtn: {
    backgroundColor: "#EEE"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center'
  },
  link: {
    color: "#00F"
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
