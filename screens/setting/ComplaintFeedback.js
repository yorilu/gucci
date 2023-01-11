import React, { forwardRef, Component, createRef } from "react";
import {
    StyleSheet,
    NativeModules,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Animated,
    Keyboard,
    ScrollView
} from "react-native";
import { px, setphoneNumer } from "../../kit/Util";
import { bottomSafeAreaHeight, ScreenInfo } from "../../kit/PlotformOS";
import { toastStr, openPicturePicker } from "../../component/TipModal";
import Drawer from '../../component/common/Drawer';
import { requestCameraPermission, requestPhotoPermission } from '../../tools/permissionUtil';
import wdys_tjzp from './images/add_pic.png'
import { queryConfigInfo } from "../../kit/IMDataManager";
import { Header } from './index'
import { chooseAlbum } from "../../kit/IMKitUtils";

const cols = 4; // 列数
const left = 15; // 左右边距
const top = 15; // 上下边距
const itemWidth = (ScreenInfo.width - (cols + 1) * left - 16) / cols; // 图片大小

export default class ComplaintFeedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            header: "意见反馈",
            name: global.nickName,
            phoneNum: setphoneNumer(global.mobileNo),
            headPic: global.headPic ? global.headPic : "default",
            textNumber: 0,
            imageNumber: 0,
            marginBottom: new Animated.Value(0),
            inputText: '',
            feedbackPics: [{
                isShowAdd: true
            }],
            keyboardH: 0, // 记录键盘高度
            keyHeight: bottomSafeAreaHeight(),
            keyStatus: false, // 记录键盘是否弹起,true 已弹起 false 未弹起
        };
        this.drawerRef = createRef();
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this._keyboardWillShow.bind(this)
        );
        this.keyboardWillHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this._keyboardWillHide.bind(this)
        );
    }

    _keyboardWillShow = (e) => {
        console.log(e.endCoordinates.height)
        console.log('_keyboardWillShow');
        this.setState(
            {
                keyHeight: e.endCoordinates.height,
                keyboardH: e.endCoordinates.height,
                keyStatus: true,
            },
            () => {
                setTimeout(() => {
                    if (this.textInput.isFocused())
                        this.sview.scrollTo({ y: this.state.keyHeight });
                }, 200);
            }
        );
    }

    _keyboardWillHide = (e) => {
        this.timer = setTimeout(() => {
            if (Platform.OS === 'android') {
                this.setState({
                    keyHeight: e.endCoordinates.height,
                    keyboardH: e.endCoordinates.height,
                    keyStatus: false,
                }, () => {
                    this.textInput && this.textInput.blur();
                });
            } else {
                this.setState({
                    keyHeight: bottomSafeAreaHeight(),
                    keyStatus: false,
                });
            }
        }, 100);
    }

    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    }

    render() {
        const { header, name, phoneNum, textNumber, imageNumber, feedbackPics, keyHeight } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>

                <Header title={header} />
                <ScrollView ref={(sview) => {
                    this.sview = sview;
                }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={{ color: "#333333", fontSize: 14, marginLeft: 20 }}>问题和意见</Text>
                        {/*<Text style={{color: "#333333", fontSize: 14, marginRight: 20}}>{textNumber}/200</Text>*/}
                    </View>
                    <TextInput
                        style={[styles.descTextInput]}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        textAlignVertical={'top'}
                        maxLength={200}
                        returnKeyType={'done'}
                        blurOnSubmit={true}
                        keyboardType="default"
                        keyboardShouldPersistTaps={'always'}
                        ref={input => this.textInput = input}
                        placeholder={"请填写10个字以上的问题描述以便我们提供个更好的帮组"}
                        placeholderTextColor="#CCCCCC"
                        value={this.state.inputText}
                        // onBlur={this._inputBlurred.bind(this, 'myTextInput')}
                        onChangeText={(inputText) => {
                            this.setState({ inputText: inputText.length > 200 ? inputText.slice(0, 200) : inputText });
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={{ color: "#333333", fontSize: 14, marginLeft: 20 }}>图片(选填，提供问题截图)</Text>
                        {/*<Text style={{color: "#333333", fontSize: 14, marginRight: 20}}>{imageNumber}/4</Text>*/}
                    </View>

                    <View style={{ backgroundColor: 'white', paddingBottom: 15 }}>
                        <FlatList
                            style={{ flexGrow: 0 }}
                            data={feedbackPics}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                        />
                    </View>

                    <Text style={{ color: "#333333", fontSize: 14, marginTop: 15, marginLeft: 20 }}>联系电话</Text>

                    <TextInput
                        ref={(ref) => (this.textInput = ref)}
                        style={[styles.phoneTextInput]}
                        underlineColorAndroid={'transparent'}
                        keyboardType='numeric'
                        multiline={true}
                        textAlignVertical={'top'}
                        maxLength={13}
                        returnKeyType={'done'}
                        blurOnSubmit={true}
                        keyboardShouldPersistTaps={'always'}
                        placeholder={"选填，便于我们与你联系"}
                        placeholderTextColor="#CCCCCC"
                    />

                    <TouchableOpacity style={{
                        width: 180,
                        height: 40,
                        marginLeft: left,
                        marginTop: 30,
                        borderRadius: 4,
                        borderWidth: 0,
                        backgroundColor: '#3c9650',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }} activeOpacity={0.8} onPress={() => {
                        this._uploadSuggest()
                    }}>
                        <Text style={{ color: 'white' }}>提交</Text>
                    </TouchableOpacity>

                    <View style={{ height: keyHeight - 70, width: 1 }} />

                </ScrollView>

                <Drawer onPress={this.openCameraClick} ref={this.drawerRef} />

            </View>
        );

    }

    _renderItem = ({ item }) => (
        <View>
            {
                item.isShowAdd ?
                    <TouchableOpacity style={{
                        width: itemWidth,
                        height: itemWidth,
                        minHeight: 65,
                        marginLeft: left,
                        marginTop: top,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: '#D5D5D5',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} activeOpacity={0.8} onPress={() => {
                        this.selectPic()
                    }}>
                        <Image style={{ width: 32, height: 32 }} source={wdys_tjzp} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{
                        width: itemWidth, height: itemWidth, marginLeft: left, marginTop: top
                        , borderRadius: 4, borderWidth: 1, borderColor: "#F6F6F6",
                        backgroundColor: "#F6F6F6"
                    }} activeOpacity={0.8} onPress={() => {
                    }}>
                        <Image style={{ flex: 1 }} source={{ uri: item.path }} />
                        {/*file:///storage/emulated/0/Android/data/com.shantai.hospital.user/files/Pictures/cc1d1f6a-97eb-4132-a59f-8a651ed42179.jpg*/}
                        {/*<Image style={{flex:1}} source={{uri:'file:///storage/emulated/0/Android/data/com.shantai.hospital.user/files/Pictures/cc1d1f6a-97eb-4132-a59f-8a651ed42179.jpg'}}/>*/}

                    </TouchableOpacity>
            }


        </View>
    );

    selectPic = () => {
        this.drawerRef.current.push();
    }

    openCameraClick = type => {
        if (0 === type) {
            requestCameraPermission()
                .then((result) => {
                    if (result) {
                        openPicturePicker('carmera', { multiple: false }, this.loadingPic)
                    } else {
                        toastStr('暂无相机授权，请前往授权')
                    }
                })
                .catch((err) => {
                    toastStr('暂无相机授权，请前往授权')
                });
        } else {
            requestPhotoPermission().then(result => {
                if (result === true || result === RESULTS.GRANTED) {
                    this.chooseWithAlbum();
                } else {
                    toastStr('暂无读取相册授权，请前往授权')
                }
            })
        }
    };

    chooseWithAlbum() {
        chooseAlbum()
            .then(res => {
                let path;
                if (Platform.OS === "android") {
                    path = res.path;
                } else {
                    path = this.subPath(res.sourceURL);
                }
                this.loadingPic(path)
            })
            .catch(e => { });
    }

    subPath(path) {
        if (Platform.OS === "ios" && path.includes("file://")) {
            let pathArr = path.split("file:///");
            return "/" + pathArr[1];
        }
        return path;
    }

    loadingPic = (data) => {
        let { feedbackPics } = this.state
        feedbackPics.pop()
        let temPic = {
            isShowAdd: false,
            path: data,
        }
        feedbackPics.push(temPic)
        if (feedbackPics && feedbackPics.length < 4) {
            let pics = {
                isShowAdd: true,
            }
            feedbackPics.push(pics)
        }
        this.setState({
            feedbackPics: feedbackPics
        })
    }

    _uploadSuggest = () => {
        const { navigation } = this.props
        if (this.state.inputText.length < 10) {
            toastStr('问题和意见必须大于10个字')
            return
        }
        const params = {
            appType: 'SAL_ASSISTANT',
            bizType: 'LOGIN',
            configKey: 'SKIP_FLAG'
        }
        queryConfigInfo(params)
            .then(res => {
                navigation.pop()
            })
            .catch(err => {
                navigation.pop()
            })
    }
}

const styles = StyleSheet.create({
    descTextInput: {
        fontSize: 14,
        height: 120,
        color: '#333333',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white'
    },
    phoneTextInput: {
        fontSize: 14,
        height: 40,
        color: '#333333',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white'
    }
});
