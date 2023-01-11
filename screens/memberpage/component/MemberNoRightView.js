/*
 * @Description:
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-01 17:13:56
 * @LastEditors: cmg
 * @LastEditTime: 2021-07-01 17:25:19
 */
import React from "react";
import {
    View,
    StyleSheet,
    Platform,
    NativeModules,
    ActivityIndicator,
    Modal,
    DeviceEventEmitter,
    StatusBar,
    Image,
    ScrollView,
    Text,
    SafeAreaView,
    Pressable,
    Linking
} from "react-native";

import { screenHeight, screenWidth } from "../../../tools/device";
import { px } from "../../../kit/Util";
import ImageAutoHeight from "./ImageAutoHeight.js"
import { toastStr, openPicturePicker } from "../../../component/TipModal";
import { RootSiblingParent } from 'react-native-root-siblings';
import { httpPost } from '../../../bridge/CommonRequestBridge';
import {ENV,SHANTAI_DOMAIN} from '../../../config.js'
import { jumpToView, VIEW_TYPE } from "../../../bridge/RouterBridge";

export default class MemberNoRightView extends React.Component {

    constructor(props){
        super(props)

        this.state={
            showActivateCardsDialog:false,
        }
    }

    render() {
        let {showActivateCardsDialog} = this.state
        return (
            <RootSiblingParent>
                <View style={{flex:1,flexDirection:'column'}}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contaner}>
                        <ImageAutoHeight source={require('./images/member-norights1.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights2.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights3.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights4.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights5.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights6.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights7.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights8.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <ImageAutoHeight source={require('./images/member-norights9.png')} width={screenWidth} setHeight={height=>{  }}/>
                        <View style={{width:screenWidth,height:80}}></View>
                    </ScrollView>
                    <View style={{
                        width:screenWidth,
                        height:60,
                        flexDirection:'row',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingLeft:16,
                        paddingRight:16,
                        backgroundColor:'white',
                        alignItems:'center'}}>

                            <Pressable style={{flexDirection:'column'}} onPress={this.tellPhone} hitSlop={{left:20,right:20,top:5,bottom:5}}>
                                <Image style={{width:24,height:24}} source={require('./images/service_icon.png')}></Image>
                                <Text style={{
                                    color:'#666666',
                                    fontSize:10,
                                    marginTop:4,
                                    marginLeft:2
                                }}>客服</Text>
                            </Pressable>

                            <Pressable style={{flex:1,marginLeft:16,justifyContent:'center',alignItems:'center',height:44,backgroundColor:'#F76E26',borderRadius:22}} onPress={this.didPressBuy}>
                                <Text style={{
                                    color:'#ffffff',
                                    fontSize:16,
                                }}>立即购买</Text>
                            </Pressable>

                    </View>
                    <Modal visible={showActivateCardsDialog} transparent={true} animationType='fade'>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <View style={{
                                height: 136,
                                width: 270,
                                borderRadius: 8,
                                backgroundColor: 'white',
                                flexDirection:'column'
                            }}>
                                <Text style={{
                                    textAlignVertical:'center',
                                    height:91,
                                    color:'rgba(34, 34, 34, 100)',
                                    fontSize:16,
                                    textAlign:'center',
                                    marginLeft:15,
                                    marginRight:15,
                                    includeFontPadding:false
                                }}>您有待激活家医会员卡，是否需要激活使用</Text>
                                <View style={{width:270,height:1,backgroundColor:'lightgray'}}></View>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <Pressable style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={this.cancelActivate}>
                                        <Text style={{
                                            color:'rgba(34, 34, 34, 100)',
                                            fontSize:16,
                                        }}>暂不激活</Text>
                                    </Pressable>
                                    <View style={{width:1,height:44,backgroundColor:'lightgray'}}></View>
                                    <Pressable style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={this.gotoActivate}>
                                        <Text style={{
                                            color:'rgba(0, 173, 120, 100)',
                                            fontSize:16,
                                        }}>去激活</Text>
                                    </Pressable>
                                </View>
                            </View>
                            
                        </View>
                    </Modal>
                </View>
            </RootSiblingParent>
        );
    }

    tellPhone=()=>{
        Linking.canOpenURL('tel:4000686868').then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: 4000686868');
            } else {
                return Linking.openURL('tel:4000686868');
            }
        }).catch(err => console.error('An error occurred', err));
    }

    didPressBuy=()=>{
        httpPost('api/futuredoctor/myPrivateDoctorApi/hasUnactivateCards' , {}, null
          ).then((res) => {
            let {result} = JSON.parse(res)

            if (result===true) {
                this.setState({
                      showActivateCardsDialog:true
                    })
              } else {
                this.cancelActivate()
              }
          }).catch((err) => {
            this.cancelActivate()
          })
    }

    cancelActivate = () => {
        this.setState({
          showActivateCardsDialog:false
        })
        let spuid = (`${ENV}` == 'prod'||`${ENV}` == 'pre')?'20210621000000000000000000206122':'20210617000000000000000000604042'
        let jumpUrl = `commonh5/index.html#/order-sales?id=${spuid}`
        this.openPage(jumpUrl)
      }
    
      gotoActivate = () => {
        this.setState({
          showActivateCardsDialog:false
        })
    
        let jumpUrl = `commonh5/index.html#/mycards`
        this.openPage(jumpUrl)
      }

      openPage=(url)=>{
        jumpToView(VIEW_TYPE.H5,"", `${SHANTAI_DOMAIN}`+ url, {});
      }
    
}

const styles = StyleSheet.create({
    
    contaner: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        // justifyContent: 'center', 
        // flex: 1,
    },
    scrollView: {
    },
    image: {
        width:screenWidth,
        resizeMode:'contain'
    },
    text: {
        fontSize: 22,
    }
})