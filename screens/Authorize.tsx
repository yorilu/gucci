import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Linking, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import React, { useState, useEffect } from 'react';
import { Text, View, Image } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import RNExitApp from 'react-native-exit-app';

//用户协议
const USER_URL  = "https://interests-m.shanghaibinyu.top/mall/pages/agreement/index?id=1628719677810249730&customerId=1553282691992756226";
//隐私政策
const PRIVATE_URL  = "https://interests-m.shanghaibinyu.top/mall/pages/agreement/index?id=1628719898564857858&customerId=1553282691992756226";

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {


  const [show, setShow] = useState(false);

  useEffect(()=>{
    async function init(){
      try{
        const authorize = await AsyncStorage.getItem('Authorize');
        if(authorize == 1){
          navigation.navigate("Main");
        }else{
          setShow(true);
        }
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
    const authorize = await AsyncStorage.setItem('Authorize', "1");
    navigation.navigate("Main");
  }

  const disagree = ()=>{
    RNExitApp.exitApp();
  }


  return (
    <View style={styles.container}>
      {show && <View style={styles.wrap}>
          <Text style={styles.title}>隐私保护提示</Text>
          <ScrollView>
            <Text>
            亲爱的用户，感谢您使用宝藏卡APP!{"\n"}
            我们非常重视您的个人信息和隐私保护。依据最新法律法规要求，我们更新了
          <TouchableWithoutFeedback onPress={goPrivate}><Text style={styles.link}>《槟宇用户隐私政策》</Text></TouchableWithoutFeedback>
          。为向您提供更好的服务，在使用我们的产品前，请您阅读完整版
          <TouchableWithoutFeedback onPress={goUser}><Text style={styles.link}>《槟宇用户服务协议》</Text></TouchableWithoutFeedback>和
          <TouchableWithoutFeedback onPress={goPrivate}><Text style={styles.link}>《槟宇用户隐私政策》</Text></TouchableWithoutFeedback>的所有条款，包括:{"\n"}
          1、为向您提供包括账户注册、商城购物、交易支付在内的基本功能，我们可能会基于具体业务场景收集您的个人信息:{"\n"}
          2、我们会基于您的授权来为您提供更好的在线点餐、在线预定酒店服务，这些授权包括定位、设备信息 (为实现信息推送，保障账户和交易安全，获取包括IMEI、 IMSI、MAC在内的设备标识符) 、存储权限，您有权拒绝或取消这些授权{"\n"}
          3.为了提高您使用我们的产品时系统的安全性，更准确地预防钓鱼网站欺诈和保护账户安全，我们必要时会通过了解您的位置、浏览信息、订单信息、设备名称、设备型号、设备识别码、网络信息等:{"\n"}
          4.未经您同意，我们不会获取、共享或向第三方提供您的信息。{"\n"}
          若您同意，请点击“同意”开始使用我们的产品和服务。感谢您对宝藏卡的信任与支持!{"\n"}
          </Text>
          </ScrollView>
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
    width: 360,
    height: 400,
    borderRadius: 6,
    padding: 15
  },
  btnWrap:{
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btn:{
    width: 60,
    height: 40,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center'
  },
  link: {
    color: "#2440b3"
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
