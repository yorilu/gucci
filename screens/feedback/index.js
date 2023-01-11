import React, {forwardRef} from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Modal
} from "react-native";

import {RootSiblingParent} from 'react-native-root-siblings';
import {isAndroid, ScreenInfo, statusBarHeight} from "../../kit/PlotformOS";
import {px, setphoneNumer} from "../../kit/Util";
import {useNavigation} from '@react-navigation/native';
import {appLogout, Logoff} from "../../bridge/IMUserBridge";
import {closeCurrentView} from "../../bridge/RouterBridge";
import Toast from '../../component/common/toast/Toast';
import {showToast} from '../../component/IMToast'

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        let pos = Platform.OS === "android" ? px(ScreenInfo.height - 80) : px(ScreenInfo.height - 150)
        this.state = {
            title: "设置",
            logoutWinVisible: false,
            logoffWinVisible: false,
            isVisiable: false,
            toastString: "",
            toastPosition: pos
        }
    }

    _renderHeaderView = () => {
        const {title} = this.state
        return (<View style={styles.nav}>
            <View style={{width: ScreenInfo.width, height: statusBarHeight()}}/>
            <View style={styles.navBarContain}>
                <TouchableOpacity style={styles.leftPosit} onPress={() => {
                    closeCurrentView()
                }}>
                    <Image resizeMode={'contain'} style={styles.leftIcon}
                           source={require('../images/home/arrowBack.png')}/>
                </TouchableOpacity>
                <Text numberOfLines={1}
                      style={{color: "#333", fontSize: 18, fontWeight: 'bold', width: px(300), textAlign: 'center'}}>
                    {title}
                </Text>
            </View>
        </View>)
    }

    _showToast = (msg, isReLogin) => {
        this.setState({
            isVisiable: true,
            toastString: msg
        })
        setTimeout(() => {
            this.setState({
                isVisiable: false
            }, async () => {
                try {
                    let a = await appLogout()
                    console.log(a)
                } catch (error) {
                    console.log(error)
                }
            })
        }, 2000);
    }

    render() {
        const {navigation} = this.props
        const {logoutWinVisible, logoffWinVisible, isVisiable, toastString, toastPosition} = this.state;
        return (<View style={{flex: 1,}}>
            <Header title={"设置"} onBack={() => {
                closeCurrentView()
            }}/>
            <RootSiblingParent>
                <ScrollView contentContainerStyle={{paddingTop: px(10)}}>
                    <ItemView title={'服务协议'} showArrowIcon={true} onPress={() => {
                        navigation.navigate('protocols')
                    }}/>
                    {
                        isAndroid() ?
                            <ItemView title={'意见反馈'} showArrowIcon={true} onPress={() => {
                                navigation.navigate('complaintFeedback')
                            }}/>
                            : null
                    }

                    <ItemView title={'关于'} showArrowIcon={true} onPress={() => {
                        navigation.navigate('about')
                    }}/>
                    <View style={{width: ScreenInfo.width, height: px(20)}}></View>
                    <ItemView title={'注销账户信息'} onPress={() => {
                        this.setState({logoffWinVisible: true})
                    }}/>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => {
                        this.setState({logoutWinVisible: true})
                    }}>
                        <Text style={{fontSize: 18, color: '#333333'}}>退出登录</Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* 退出登录的弹框  */}
                <Modal visible={logoutWinVisible} transparent={true}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={styles.logoutWin}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 16, color: '#666',}}>确定退出登录吗？</Text>
                            </View>
                            <View style={styles.btnContain}>
                                <TouchableOpacity style={[styles.btn]} onPress={() => {
                                    this.setState({logoutWinVisible: false})
                                }}>
                                    <Text style={{color: '#666', fontSize: 16}}>取消</Text>
                                </TouchableOpacity>
                                <View style={{height: '100%', width: px(1), backgroundColor: '#EEE'}}/>
                                <TouchableOpacity style={[styles.btn]} onPress={async () => {
                                    try {
                                        let a = await appLogout()
                                        console.log(a)
                                    } catch (error) {
                                        console.log(error)
                                    }
                                    this.setState({logoutWinVisible: false})
                                }}>
                                    <Text style={{color: '#3F78FC', fontSize: 16}}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* 注销账号的弹框  */}
                <Modal visible={logoffWinVisible} transparent={true}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={styles.logoutWin}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: '#666', marginBottom: px(5)}}>高风险警示</Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#999',
                                }}>您正在删除账号：{setphoneNumer(global.mobileNo)}</Text>
                                <Text style={{fontSize: 14, color: '#999',}}>此操作将让您失去本账号</Text>
                            </View>
                            <View style={styles.btnContain}>
                                <TouchableOpacity style={[styles.btn]} onPress={() => {
                                    this.setState({logoffWinVisible: false})
                                }}>
                                    <Text style={{color: '#3F78FC', fontSize: 16}}>再考虑下</Text>
                                </TouchableOpacity>
                                <View style={{height: '100%', width: px(1), backgroundColor: '#EEE'}}/>
                                <TouchableOpacity style={[styles.btn]} onPress={async () => {
                                    const params = {
                                        "operatorNo": global.userId,
                                        "appType": isAndroid() ? "ANDROID" : "IOS",
                                        "traceLogId": "121432423"
                                    }
                                    Logoff(params)
                                        .then(async (res) => {
                                            if (JSON.parse(res).success == false) {
                                                this._showToast(JSON.parse(res).errorMsg, false)
                                            } else {
                                                global.nickName = ''
                                                global.userId = ''
                                                global.headPic = ''
                                                global.mobileNo = ''
                                                if (Platform.OS === 'android') {
                                                    showToast("注销账号成功")
                                                    try {
                                                        let a = await appLogout()
                                                        console.log(a)
                                                    } catch (error) {
                                                        console.log(error)
                                                    }
                                                } else {
                                                    this._showToast("注销账号成功", true)
                                                }
                                            }
                                        })
                                        .catch(err => {
                                            this._showToast("注销账号失败", false)
                                        })
                                    this.setState({logoffWinVisible: false})
                                }}>
                                    <Text style={{color: '#666', fontSize: 16}}>删除账号</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Toast
                    ref={this.toastRef}
                    visible={isVisiable}
                    position={toastPosition}
                    backgroundColor={'#3F78FC'}
                    opacity={0.8}
                    shadow={false}
                    animation={false}
                    hideOnPress={true}
                >{toastString}
                </Toast>
            </RootSiblingParent>
        </View>)
    }
}

export const Header = forwardRef((props, ref) => {
    const navigation = useNavigation()
    return (<View style={styles.nav}>
        <View style={{width: ScreenInfo.width, height: statusBarHeight()}}/>
        <View style={styles.navBarContain}>
            <TouchableOpacity style={styles.leftPosit} onPress={() => {
                closeCurrentView()
            }}>
                <Image resizeMode={'contain'} style={styles.leftIcon} source={require('../images/home/arrowBack.png')}/>
            </TouchableOpacity>
            <Text numberOfLines={1} style={{
                color: "#333",
                fontSize: 18,
                fontWeight: 'bold',
                width: px(300),
                textAlign: 'center'
            }}>{props.title}</Text>
        </View>
    </View>)
})


export const ItemView = forwardRef((props, ref) => {
    return <TouchableOpacity style={styles.cellView} onPress={() => {
        props.onPress && props.onPress()
    }}>
        <View>
            {props.title ? <Text style={{fontSize: 14, color: '#666'}}>{props.title}</Text> : null}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.arrowTxt ?
                <Text style={{fontSize: 14, color: '#000', marginRight: px(6)}}>{props.arrowTxt}</Text> : null}
            {props.showArrowIcon ? <Image resizeMode={'contain'} style={styles.rightArrow}
                                          source={require('../images/home/arrowBack.png')}/> : null}
        </View>
    </TouchableOpacity>
})

// export const LogoutModal = forwardRef((props, ref) => {
//     let [visible, setVisible] = useState(false)
//     useImperativeHandle(ref, () => ({
//         show: () => setVisible(true),
//         hide: () => setVisible(false)
//     }))

//     return <Modal visible={visible} transparent={true}  >
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <View style={styles.logoutWin}>
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 16, color: '#666', }}>确定退出登录吗？</Text>
//                 </View>
//                 <View style={styles.btnContain}>
//                     <TouchableOpacity style={[styles.btn]} onPress={() => {
//                         setVisible(false)
//                     }}>
//                         <Text style={{ color: '#666', fontSize: 16 }}>取消</Text>
//                     </TouchableOpacity>
//                     <View style={{ height: '100%', width: px(1), backgroundColor: '#EEE' }} />
//                     <TouchableOpacity style={[styles.btn]} onPress={async () => {
//                         try {
//                             let a = await appLogout()
//                             console.log(a)
//                         } catch (error) {
//                             console.log(error)
//                         }
//                         setVisible(false)
//                     }}>
//                         <Text style={{ color: '#3F78FC', fontSize: 16 }}>确定</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     </Modal>
// })

// export const LogoffModal = forwardRef((props, ref) => {
//     let [visible, setVisible] = useState(false)
//     useImperativeHandle(ref, () => ({
//         show: () => setVisible(true),
//         hide: () => setVisible(false)
//     }))

//     return <Modal visible={visible} transparent={true}  >
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <View style={styles.logoutWin}>
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 18, color: '#666',marginBottom:px(5) }}>高风险警示</Text>
//                     <Text style={{ fontSize: 14, color: '#999', }}>您正在删除账号：{setphoneNumer(global.mobileNo)}</Text>
//                     <Text style={{ fontSize: 14, color: '#999', }}>此操作将让您失去本账号</Text>
//                 </View>
//                 <View style={styles.btnContain}>
//                     <TouchableOpacity style={[styles.btn]} onPress={() => {                        
//                         setVisible(false);                       
//                     }}>
//                         <Text style={{ color: '#3F78FC', fontSize: 16 }}>再考虑下</Text>
//                     </TouchableOpacity>
//                     <View style={{ height: '100%', width: px(1), backgroundColor: '#EEE' }} />
//                     <TouchableOpacity style={[styles.btn]} onPress={async () => {
//                         const params = {
//                             "operatorNo": global.userId,
//                             "appType": isAndroid?"ANDROID":"IOS",
//                             "traceLogId": "121432423"
//                         }
//                         Logoff (params)
//                         .then(async(res) => {
//                             console.log('注销Success', res)
//                             if(JSON.parse(res).success==false){                                
//                                 showToast(JSON.parse(res).errorMsg)
//                             }else{
//                                 showToast("注销账号成功")
//                                 global.nickName = ''
//                                 global.userId = ''
//                                 global.headPic = ''
//                                 global.mobileNo = ''
//                                 try {
//                                     let a = await appLogout()
//                                     console.log(a)
//                                 } catch (error) {
//                                     console.log(error)
//                                 }                               
//                             }                           
//                         })
//                         .catch(err => {
//                             showToast("注销账号失败")
//                         })
//                         setVisible(false)
//                     }}>
//                         <Text style={{ color: '#666', fontSize: 16 }}>删除账号</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     </Modal>
// })

const styles = StyleSheet.create({
    nav: {
        width: ScreenInfo.width,
        backgroundColor: '#FFF'
    },
    navBarContain: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: px(45)
    },
    leftIcon: {
        width: px(11),
        height: px(20),
        tintColor: '#666',
        transform: [{
            rotate: '180deg'
        }]
    },
    leftPosit: {
        position: 'absolute',
        width: px(40),
        height: px(45),
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
    },
    cellView: {
        width: ScreenInfo.width,
        paddingLeft: px(16),
        paddingRight: px(18),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
        marginBottom: px(1),
        height: px(55)
    },
    rightArrow: {
        width: px(7),
        height: px(12),
        tintColor: '#CCC'
    },
    logoutBtn: {
        width: px(335),
        height: px(44),
        borderWidth: px(1),
        borderColor: '#CCC',
        borderRadius: px(22),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: px(26)
    },
    loadingView: {
        width: px(141),
        height: px(101),
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: px(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutWin: {
        width: px(270),
        height: px(144),
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: px(6)
    },
    btnContain: {
        width: px(270),
        height: px(44),
        flexDirection: 'row',
        borderTopColor: '#EEE',
        borderTopWidth: px(1)
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})